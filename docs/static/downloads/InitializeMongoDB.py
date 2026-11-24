import sys
import argparse
import certifi
import urllib.parse
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

ROLES = [
    {
        "id": "proj_collaborator",
        "name": "Project Collaborator",
        "permissions": [
            "view_project",
            "review_record",
            "update_coordinates",
        ],
        "includes": [],
        "category": "project"
    },
    {
        "id": "proj_manager",
        "name": "Project Manager",
        "permissions": [
            "manage_project",
            "verify_record",
            "view_project",
            "review_record",
            "clean_record",
            "update_coordinates",
        ],
        "includes": [
            "proj_collaborator"
        ],
        "category": "project"
    },
    {
        "id": "sys_admin",
        "name": "System Admin",
        "permissions": [
            "create_project",
            "create_record_group",
            "create_team",
            "upload_document",
            "add_user",
            "manage_team",
            "manage_project",
            "review_record",
            "view_project",
            "verify_record",
            "delete",
            "manage_system",
            "clean_record",
            "system_administration",
            "developer",
            "view_schema",
            "manage_schema",
            "manage_schema_destructive",
            "update_coordinates",
        ],
        "includes": [
            "team_lead"
        ],
        "category": "system"
    },
    {
        "id": "developer",
        "name": "Developer",
        "permissions": [
            "create_project",
            "create_record_group",
            "create_team",
            "upload_document",
            "add_user",
            "manage_team",
            "manage_project",
            "review_record",
            "view_project",
            "verify_record",
            "manage_system",
            "clean_record",
            "view_schema",
            "manage_schema",
            "developer",
            "update_coordinates",
        ],
        "includes": [
            "team_lead"
        ],
        "category": "system"
    },
    {
        "id": "team_lead",
        "name": "Team Lead",
        "permissions": [
            "manage_team",
            "manage_project",
            "verify_record",
            "view_project",
            "review_record",
            "add_user",
            "clean_record",
            "update_coordinates",
        ],
        "includes": [
            "team_member",
            "proj_manager"
        ],
        "category": "team"
    },
    {
        "id": "team_member",
        "name": "Team Member",
        "permissions": [
            "view_project",
            "review_record",
            "update_coordinates",
        ],
        "includes": [
            "proj_collaborator"
        ],
        "category": "team"
    }
]

def connectToDatabase(DB_USERNAME, DB_PASSWORD, DB_CONNECTION):
    if DB_CONNECTION.startswith("mongodb://") or DB_CONNECTION.startswith("mongodb+srv://"):
        uri = DB_CONNECTION
        client = MongoClient(uri, server_api=ServerApi("1"))
    else:
        ca = certifi.where()
        username = urllib.parse.quote_plus(DB_USERNAME or "")
        password = urllib.parse.quote_plus(DB_PASSWORD or "")
        db_connection = urllib.parse.quote_plus(DB_CONNECTION)
        uri = f"mongodb+srv://{username}:{password}@{db_connection}.mongodb.net/?retryWrites=true&w=majority"
        client = MongoClient(uri, server_api=ServerApi("1"), tlsCAFile=ca)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command("ping")
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"unable to connect to db: {e}")

    return client


def initializeDatabaseCollections(team_name, email, assigned_role, db, force=False):
    existing_collections = [
        name for name in db.list_collection_names() if not name.startswith("system.")
    ]
    if existing_collections and not force:
        print(
            f"Database '{db.name}' already contains collections ({', '.join(sorted(existing_collections))}); "
            "skipping initialization to prevent overwriting existing data. Pass --force to override."
        )
        return
    print(f"initializing database with team name: {team_name} and email: {email} with assigned role: {assigned_role}")
    new_team = {
        "name": team_name,
        "display_name": team_name,
        "users": [email],
        "project_list": []
    }
    new_user = {
        "email": email,
        "default_team": team_name,
        "roles": {
            "system": [
                "sys_admin"
            ],
            "team": {
                team_name: [
                    "team_lead"
                ]
            }
        }
    }
    db.roles.insert_many(ROLES)
    db.teams.insert_one(new_team)
    db.users.insert_one(new_user)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-t", "--team_name", help="Initial team name")
    parser.add_argument("-e", "--email", help="Email of initial user")
    parser.add_argument("-a", "--assigned_role", help="Assigned role of user. Optional, must be one of sys_admin, team_lead, or team_member. If not provided, or provided incorrectly, will default to sys_admin.")
    parser.add_argument("-dbu", "--database_username", help="Database username (optional when --database_hostname is a full mongodb:// or mongodb+srv:// URI)")
    parser.add_argument("-dbp", "--database_password", help="Database user password (optional when --database_hostname is a full mongodb:// or mongodb+srv:// URI)")
    parser.add_argument("-dbh", "--database_hostname", help="Database cluster host name or full mongodb:// / mongodb+srv:// URI")
    parser.add_argument("-dbn", "--database_name", help="Database name")
    parser.add_argument("--force", action="store_true", help="Proceed even if the target database already has collections")

    args = parser.parse_args()
    required_args = ["team_name", "email", "database_hostname", "database_name"]
    if args.database_hostname and not (
        args.database_hostname.startswith("mongodb://")
        or args.database_hostname.startswith("mongodb+srv://")
    ):
        required_args.extend(["database_username", "database_password"])

    for required_arg in required_args:
        if args.__dict__[required_arg] is None:
            print(f"{required_arg} is required")
            sys.exit()

    try:
        client = connectToDatabase(args.database_username, args.database_password, args.database_hostname)
        db = client[args.database_name]
    except Exception as e:
        print(f"unable to connect to database: {e}")
        sys.exit()

    assigned_role = args.assigned_role
    if assigned_role is None:
        assigned_role = "sys_admin"
    initializeDatabaseCollections(args.team_name, args.email, assigned_role, db, force=args.force)
