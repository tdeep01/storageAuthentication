```
steps to run
    npm install (node version >= 18)
    docker-compose up need docker and docker-compose to be present in the machine

    else 
    
    npm run start but have to provide mongouri in the env file


use api collection provided:
    api/auth/register
        {
            "username" : "test",
            "password" : "test"
        }
    api/auth/login
        {
            "username" : "test",
            "password" : "test"
        }
        response => Bearer token
    api/upload
        header
            authorization : response from login api
        formData 
            file a.csv
        response => fileid and file saved in storage/upload folder with encrypted name
    api/download/:id
        response => file in form of stream and file saved in storage/download folder with orignal name
```
