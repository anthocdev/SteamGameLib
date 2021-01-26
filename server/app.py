from flask import Flask, jsonify, make_response, request, _request_ctx_stack
from six.moves.urllib.request import urlopen
import uuid
import random
import json
import pymongo
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
from jose import jwt
from datetime import datetime
from bson.decimal128 import Decimal128
import re
from functools import wraps


app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'

CORS(app)

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.local
games = db.GameListings

# Auth0 API Verification
domain = 'dev-e8wndv0o.auth0.com'
audience = 'http://localhost:5000'


# Error handler
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                         "description":
                         "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must start with"
                         " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                         "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must be"
                         " Bearer token"}, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the Access Token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen("https://" + domain + "/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=['RS256'],
                    audience=audience,
                    issuer="https://"+domain+"/"
                )
                print(payload)
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                 "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                 "description":
                                 "incorrect claims,"
                                 "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                 "description":
                                 "Unable to parse authentication"
                                 " token."}, 401)

            _request_ctx_stack.top.current_user = payload
            print(payload)
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                         "description": "Unable to find appropriate key"}, 401)
    return decorated


def requires_permission(required_permission):
    # Determining if user token contains permission specified
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    print(unverified_claims)
    if unverified_claims.get("permissions"):
        token_permissions = unverified_claims["permissions"]
        for token_permission in token_permissions:
            if token_permission == required_permission:
                return True
    return False


def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return func(*args, **kwargs)
    return jwt_required_wrapper


@app.route('/api/v1.0/login', methods=['GET'])
def login():
    auth = request.authorization
    if auth and auth.password == 'password':
        token = jwt.encode({'user': auth.username, 'exp': datetime.datetime.utcnow(
        ) + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('UTF-8')})
    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm = "Login required"'})

# region - Generalized statistics of specific subtypes


@app.route("/api/v1.0/games/stats/genres", methods=["GET"])
def show_all_genres():
    pipeline = [{"$unwind": "$genres"},
                {"$group": {"_id": "$genres", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10},
                {"$project": {"genre": "$_id", "count": 1}}]
    data_to_return = []
    cursor = games.aggregate(pipeline)
    for item in cursor:
        data_to_return.append(item)

    return make_response(jsonify(list(data_to_return)), 200)


@app.route("/api/v1.0/games/stats/categories", methods=["GET"])
def show_all_categories():
    pipeline = [{"$unwind": "$categories"},
                {"$group": {"_id": "$categories", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10},
                {"$project": {"category": "$_id", "count": 1}}]
    data_to_return = []
    cursor = games.aggregate(pipeline)
    for item in cursor:
        data_to_return.append(item)

    return make_response(jsonify(list(data_to_return)), 200)


@app.route("/api/v1.0/games/stats/platforms", methods=["GET"])
def show_all_platforms():
    # Verify that read:platforms permission exists within token -- Disabled Due to long response times from auth0
    # if requires_permission("read:platforms"):
    pipeline = [{"$unwind": "$platforms"},
                {"$group": {"_id": "$platforms", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 3},
                {"$project": {"platform": "$_id", "count": 1}}]
    data_to_return = []
    cursor = games.aggregate(pipeline)
    for item in cursor:
        data_to_return.append(item)

    return make_response(jsonify(list(data_to_return)), 200)
    # else:
    #     raise AuthError({"code": "Unauthorized",
    #                      "description": "You have no rights to access this resource"}, 403)


@app.route("/api/v1.0/games/stats/steamspy", methods=["GET"])
@requires_auth
def show_all_steamspy():
    pipeline = [{"$unwind": "$steamspy_tags"},
                {"$group": {"_id": "$steamspy_tags", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10},
                {"$project": {"steamspy_tag": "$_id", "count": 1}}]
    data_to_return = []
    cursor = games.aggregate(pipeline)
    for item in cursor:
        data_to_return.append(item)

    return make_response(jsonify(list(data_to_return)), 200)


@app.route("/api/v1.0/games/stats/publisher", methods=["GET"])
def show_all_publishers():
    pipeline = [{"$unwind": "$publisher"},
                {"$group": {"_id": "$publisher", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10},
                {"$project": {"publisher": "$_id", "count": 1}}]
    data_to_return = []
    cursor = games.aggregate(pipeline)
    for item in cursor:
        data_to_return.append(item)

    return make_response(jsonify(list(data_to_return)), 200)


@app.route("/api/v1.0/games/stats/developer", methods=["GET"])
def show_all_developers():
    pipeline = [{"$unwind": "$developer"},
                {"$group": {"_id": "$developer", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10},
                {"$project": {"developer": "$_id", "count": 1}}]
    data_to_return = []
    cursor = games.aggregate(pipeline)
    for item in cursor:
        data_to_return.append(item)

    return make_response(jsonify(list(data_to_return)), 200)

# endregion


def return_sort_query(sortEnum):
    switcher = {
        1: "release_date",
        2: "price"
    }
    return switcher.get(sortEnum, "price")


def return_sort_struct(sortStruct):
    switcher = {
        1: pymongo.DESCENDING,
        2: pymongo.ASCENDING
    }
    print(sortStruct)
    return switcher.get(sortStruct, pymongo.DESCENDING)


# @app.route("/api/v1.0/games", methods=["GET"])
# def show_all_games():
#     page_num, page_size = 1, 10
#     name = ''
#     sortType, sortStruct = 0, 0
#     if request.args.get('pn'):
#         page_num = int(request.args.get('pn'))
#     if request.args.get('ps'):
#         page_size = int(request.args.get('ps'))
#     if request.args.get('name'):
#         name = str(request.args.get('name'))
#     if request.args.get('sort'):
#         sortType = int(request.args.get('sort'))
#     if request.args.get('sortStruct'):
#         sortStruct = int(request.args.get('sortStruct'))
#     page_start = (page_size * (page_num - 1))

#     name_contains_regx = re.compile(
#         '\\b' + name + '\\b', re.IGNORECASE)

#     data_to_return = []
#     result = ''

#     if(sortType > 0):
#         result = games.find({'name': name_contains_regx}).skip(page_start).limit(
#             page_size).sort(return_sort_query(sortType), return_sort_struct(sortStruct))
#     else:
#         result = games.find({'name': name_contains_regx}).skip(
#             page_start).limit(page_size)

#     for game in result:
#         game['_id'] = str(game['_id']),
#         game['price'] = float(game['price'].to_decimal())
#         for comment in game['comments']:
#             comment['_id'] = str(comment['_id'])
#         data_to_return.append(game)
#         print(result)

#     return make_response(jsonify(data_to_return), 200)

@app.route("/api/v1.0/games", methods=["GET"])
def show_all_games():
    page_num, page_size = 1, 10
    name = ''
    sortType, sortStruct = 0, 0
    if request.args.get('pn'):
        page_num = int(request.args.get('pn'))
    if request.args.get('ps'):
        page_size = int(request.args.get('ps'))
    if request.args.get('name'):
        name = str(request.args.get('name'))
    if request.args.get('sort'):
        sortType = int(request.args.get('sort'))
    if request.args.get('sortStruct'):
        sortStruct = int(request.args.get('sortStruct'))
    page_start = (page_size * (page_num - 1))

    name_contains_regx = re.compile(
        '\\b' + name + '\\b', re.IGNORECASE)

    data_to_return = []
    result = ''

    if(sortType > 0):
        result = games.find({'name': name_contains_regx, "steamspy_tags": {"$not": {"$elemMatch": {"$eq": "Sexual Content"}}}}).skip(page_start).limit(
            page_size).sort(return_sort_query(sortType), return_sort_struct(sortStruct))
    else:
        result = games.find({'name': name_contains_regx, "steamspy_tags": {"$not": {"$elemMatch": {"$eq": "Sexual Content"}}}}).skip(
            page_start).limit(page_size)
    pageResult = page_size * page_num
    for game in result:
        game['_id'] = str(game['_id']),
        game['price'] = float(game['price'].to_decimal())

        for comment in game['comments']:
            comment['_id'] = str(comment['_id'])
        data_to_return.append(game)

    print(str(result.count(False)) + ' AND ' + str(pageResult))
    isLastPage = False
    if(pageResult >= result.count(False)):
        isLastPage = True
    else:
        isLastPage = False

    return make_response(jsonify({'gameData': data_to_return, 'lastPage': isLastPage}), 200)


@app.route("/api/v1.0/games/<int:id>", methods=["GET"])
def show_one_game(id):
    game = games.find_one({'appid': (id)})
    if game is not None:
        game['_id'] = str(game['_id']),
        game['price'] = float(game['price'].to_decimal())
        # For loop comments array here
        for comment in game['comments']:
            comment['_id'] = str(comment['_id'])
        return make_response(jsonify(game), 200)
    else:
        return make_response(jsonify({"error": "Invalid game appid"}), 404)

# Posting for games is not utilized hence fields are not specified, nonethless POST capabilities are fully utilized in comments posting.
@app.route("/api/v1.0/games", methods=["POST"])
def add_game():
    if "appid" in request.form and "name" in request.form:
        new_game = {
            "appid": int(request.form["appid"]),
            "name": request.form["name"],
            "release_date": datetime(2010, 12, 3),
            "english": "1",
            "developer": [],
            "publisher": [],
            "platforms": [],
            "required_age": 0,
            "categories": [],
            "genres": [],
            "steamspy_tags": [],
            "achievements": 0,
            "positive_ratings": 1111,
            "negative_ratings": 1111,
            "average_playtime": 1111,
            "median_playtime": 1111,
            "owners": "test",
            "price": Decimal128('7.19'),
            "comments": []
        }
        # Get object id, if needed, not necessary since appid unique indexing
        new_game_id = games.insert_one(new_game)
        new_game_link = "http://localhost:5000/api/v1.0/games/" + \
            request.form["appid"]
        return make_response(jsonify({"url": new_game_link}), 201)
    else:
        return make_response(jsonify({"error": "Missing form data"}), 404)


@app.route("/api/v1.0/games/<int:id>", methods=["PUT"])
def edit_game(id):
    if "appid" in request.form and "name" in request.form:
        result = games.update_one({"appid": (id)}, {
                                  "$set": {"appid": int(request.form["appid"]), "name": request.form["name"]}})

        if result.matched_count == 1:
            edited_game_link = "http://localhost:5000/api/v1.0/games/" + \
                str(request.form["appid"])
            return make_response(jsonify({"url": edited_game_link}), 200)
        else:
            return make_response(jsonify({"error": "Invalid game appid"}), 404)

    else:
        return make_response(jsonify({"error": "Missing form data"}), 404)


@app.route("/api/v1.0/games/<int:id>", methods=["DELETE"])
def delete_game(id):
    result = games.delete_one({"appid": id})
    if result.deleted_count == 1:
        return make_response(jsonify({"info": "Game with appid " + str(id) + " has been dropped from the database."}), 200)
    else:
        return make_response(jsonify({"error": "Invalid game appid"}), 404)


@app.route("/api/v1.0/games/<int:id>/comments", methods=["GET"])
def fetch_all_comments(id):
    data_to_return = []
    game = games.find_one({"appid": id}, {"comments": 1, "_id": 0})
    for comment in game["comments"]:
        comment["_id"] = str(comment["_id"])
        data_to_return.append(comment)
    return make_response(jsonify(data_to_return), 200)

# Todo - Check that user did not post comments here before.
@app.route("/api/v1.0/games/<int:gid>/comments", methods=["POST"])
def add_new_comment(gid):

    new_comment = {
        "_id": ObjectId(),
        "username": request.form["username"],
        "comment": request.form["comment"],
        "userid": request.form["userid"],
        "imageLink": request.form["imageLink"],
        "review_type": int(request.form["review_type"]),
        "postDate": datetime.strptime(request.form["postDate"], '%Y-%m-%d %H:%M:%S')
    }
    games.update_one({"appid": gid}, {"$push": {"comments": new_comment}})
    new_comment_link = "http://localhost:5000/api/v1.0/games/" + \
        str(gid) + "/comments/" + str(new_comment['_id'])
    print(request.form["review_type"])
    return make_response(jsonify({"url": new_comment_link}), 201)

# Return single comment
@app.route("/api/v1.0/games/<int:gid>/comments/<string:cid>", methods=["GET"])
def get_one_comment(gid, cid):
    data_to_return = []
    comment = games.find_one({"appid": gid, "comments._id": ObjectId(cid)}, {
                             "_id": 0, "comments.$": 1})
    for comment in comment["comments"]:
        comment["_id"] = str(comment["_id"])
        data_to_return.append(comment)
    return make_response(jsonify(data_to_return), 200)


@app.route("/api/v1.0/games/<int:gid>/comments/<string:cid>", methods=["PUT"])
@requires_auth
def edit_comment(gid, cid):
    commentLink = "http://localhost:5000/api/v1.0/games/" + \
        str(gid) + "/comments/" + cid
    result = games.update_one({"appid": gid, "comments._id": ObjectId(cid)},
                              {"$set": {"comments.$.userid": request.form["userid"],
                                        "comments.$.comment": request.form["comment"],
                                        "comments.$.review_type": int(request.form["review_type"]),
                                        "comments.$.username": request.form["username"],
                                        "comments.$.imageLink": request.form["imageLink"],
                                        "comments.$.postDate": datetime.strptime(request.form["postDate"], '%Y-%m-%d %H:%M:%S')}})
    if result.modified_count == 1:
        return make_response(jsonify({"info": "Comment has been updated", "url": commentLink}), 201)
    elif result.matched_count == 1:
        return make_response(jsonify({"info": "No changes were made", "url": commentLink}), 200)
    elif result.matched_count == 0:
        return make_response(jsonify({"error": "Comment not found"}), 404)
    else:
        return make_response(jsonify({"error": "Invalid Request"}), 404)


@app.route("/api/v1.0/games/<int:gid>/comments/<string:cid>", methods=["DELETE"])
@requires_auth
def delete_comment(gid, cid):
    result = games.update_one({"appid": gid, "comments._id": ObjectId(cid)}, {
        "$pull": {"comments": {"_id": ObjectId(cid)}}})
    if result.modified_count == 1:
        return make_response(jsonify({"info": "The comment has been deleted"}), 200)
    else:
        return make_response(jsonify({"error": "Comment not found"}), 404)

# Region - User Comments

# Returns comments by user ID with appid and name of the game containing it.
@app.route("/api/v1.0/comments/<string:uid>", methods=["GET"])
@requires_auth
def fetch_comments_by_user(uid):
    pipeline = [{"$unwind": "$comments"},
                {"$match": {"comments.userid": uid}},
                {"$project": {"comment": "$comments", "appid": 1, "name": 1, "_id": 0}}]
    data_to_return = []
    cursor = games.aggregate(pipeline)
    for item in cursor:
        item['comment']['_id'] = str(item['comment']['_id'])
        data_to_return.append(item)

    return make_response(jsonify(list(data_to_return)), 200)


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
