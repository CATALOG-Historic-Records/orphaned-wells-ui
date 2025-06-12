
export function MongoOverview() {
    return (
        <div>
            OGRRE requires a database to handle storage of records, projects, users, and more. It is configured to work with any MongoDB instance. MongoDB is a NoSQL database with cloud support and options for free tier databases. To learn more about MongoDB, <a target='_blank' href="https://www.mongodb.com/atlas">click here</a>. To learn how to configure OGRRE with your database, read the following tutorials.
        </div>
    );
}

export function HowToSetupMongo() {
  return (
    <div>
      <ol>
        <li><p>
          MongoDB can be set up locally or in the cloud. <a target='_blank' href="https://www.mongodb.com/products/platform/atlas-database">MongoDB Atlas</a> allows users to create one free tier database cluster with the cloud provider of your choice. OGRRE depends on GCP for other cloud services, so if using Atlas, it likely makes the most sense to use GCP. 
        </p></li>
        <li><p>
          To create a project and your free cluster, see the <a target='_blank' href="https://www.mongodb.com/docs/atlas/government/tutorial/create-project/">MongoDB documentation</a>. The documentation also provides instructions on how to <a target='_blank' href="https://www.mongodb.com/docs/atlas/government/tutorial/create-mongodb-user-for-cluster/">create a database user</a> and <a target='_blank' href="https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/">connect to your database</a>. To connect your database to OGRRE, you will need to create a database user.
        </p></li>
        <li><p>
          To connect to the database, you must also ensure that the IP address you want to connect from is added to the access list. In the case of OGRRE, the backend IP address must be added to this list to allow it to access and update the database records. For information on how to add an IP address, see <a target='_blank' href="https://www.mongodb.com/docs/atlas/security/ip-access-list/. ">here</a>.
        </p></li>
      </ol>
    </div>
  );
}

export function InitializeDatabase() {
  return (
    <div>
      OGRRE stores teams, authorized users, and assigned roles/permissions in the MongoDB database. So in order for OGRRE to run with a new database, some initial collections and documents must be created. The collections <code>teams</code>, <code>users</code>, and <code>roles</code> must be created before running OGRRE. There must be at least one team and one user associated with that team, as well as a list of roles that are specific to OGRRE. You can create these manually, or use the python script we have provided to create these documents for you. The script is called <code>initializeMongoDB.py</code>, and can be downloaded <a target="_blank">here TODO: add link</a>. The script takes the following arguments:
      <ul>
        <li><b>team_name</b> (<b>-t</b>): the initial team name [<i>required</i>]</li>
        <li><b>email</b> (<b>-e</b>): email of the initial user [<i>required</i>]</li>
        <li><b>assigned_role</b> (<b>-a</b>): The role for the user you are creating. If not provided, the user will be assigned the role of <code>sys_admin</code> which contains all system and team permissions [<i>optional</i>]</li>
      </ul>
    </div>
  );
}

export function MongoEnvironmentVariables() {
  return (
    <div>
      The OGRRE backend requires 4 environment variables from your MongoDB setup. As explained in the <a href="getting_started">backend installation section</a>, the following variables must go inside your <code>.env</code> file.
      <ul>
        <li>
          DB_USERNAME: the username for the database user you created.
        </li>
        <li>
          DB_PASSWORD: the password for the database user you created.
        </li>
        <li>
          DB_CONNECTION: The cluster connection string.
        </li>
        <li>
          DB_NAME: The name of the database inside your cluster that you would like to connect to.
        </li>
      </ul>
      Your MongoDB database connection uri should look like this, substituting the bracketed variables with your credentials:
      <p>
      <code>mongodb+srv://&lt;DB_USERNAME&gt;:&lt;DB_PASSWORD&gt;@&lt;DB_CONNECTION&gt;.mongodb.net</code>
      </p>
    </div>
  );
}