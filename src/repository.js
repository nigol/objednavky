export function Repository(auth, username, user) {
    let items;
            
    const AWS = require("aws-sdk");
    AWS.config.region = 'eu-west-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-1:c5662018-7e7a-492a-b398-278c64553a33',
        Logins: {"cognito-idp.eu-west-1.amazonaws.com/eu-west-1_hJv7Lgb29": auth.getIdToken().getJwtToken()}
    });
    const docClient = new AWS.DynamoDB.DocumentClient();
    
    AWS.config.credentials.refresh((error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Successfully logged!');
        }
    });
            
    const uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
            });
    }
    
    return ({
        /**
        * @param invocation {data:, successHandler: data => data, errorHandler: err => err}
        */
        getAllItems: invocation => {
            const sorter = (a, b) => {
                const aDate = (a.dateOfPay !== undefined && a.dateOfPay.length === 10) ? a.dateOfPay : "99.99.9999";
                const bDate = (b.dateOfPay !== undefined && b.dateOfPay.length === 10) ? b.dateOfPay : "99.99.9999";
                const aSplit = aDate.split(".");
                const bSplit = bDate.split(".");
                let day = aSplit[0];
                let month = aSplit[1];
                let year = aSplit[2];
                const aNum = parseInt("" + year + month + day);
                day = bSplit[0];
                month = bSplit[1];
                year = bSplit[2];
                const bNum = parseInt("" + year + month + day);
                return parseInt(bNum) - parseInt(aNum);
            };
            if (items === undefined) {
                let params = {
                    TableName : "objednavky",
                    KeyConditionExpression: "#uId = :id",
                    ExpressionAttributeNames:{
                        "#uId": "userId"
                    },
                    ExpressionAttributeValues: {
                        ":id": username
                    }
                };
                docClient.query(params, (err, data) => {
                    if (!err) {
                        items = data.Items;
                        items.sort(sorter);
                        invocation.successHandler(items);
                    } else {
                        invocation.errorHandler(err);
                    }
                });
            } else {
                invocation.successHandler(items);
            }
        },
        
        saveItem: invocation => {
            invocation.data.userId = username;
            let params = {
                TableName: "objednavky",
                Item: invocation.data
            };
            if (invocation.data.id === undefined) {
                params.Item.id = uuidv4();
                docClient.put(params, (err, result) => {
                    if (err) {
                        invocation.errorHandler(err);
                    } else {
                        items.unshift(invocation.data);
                        invocation.successHandler(invocation.items);
                    }
                });
            } else {
                Object.keys(invocation.data).map(k => invocation.data[k] === "" ? invocation.data[k] = undefined : invocation.data[k]);
                let whatToUpdate = "set ";
                whatToUpdate = invocation.data.address === undefined ? whatToUpdate : whatToUpdate + "address = :adr,";
                whatToUpdate = invocation.data.amount === undefined ? whatToUpdate : whatToUpdate + "amount = :am,";
                whatToUpdate = invocation.data.dateOfPay === undefined ? whatToUpdate : whatToUpdate + "dateOfPay = :dop,";
                whatToUpdate = invocation.data.email === undefined ? whatToUpdate : whatToUpdate + "email = :em,";
                whatToUpdate = invocation.data.isPaid === undefined ? whatToUpdate : whatToUpdate + "isPaid = :ip,";
                whatToUpdate = invocation.data.isSent === undefined ? whatToUpdate : whatToUpdate + "isSent = :is,";
                whatToUpdate = invocation.data.item === undefined ? whatToUpdate : whatToUpdate + "#i = :it,";
                whatToUpdate = invocation.data.name === undefined ? whatToUpdate : whatToUpdate + "#n = :nam,";
                whatToUpdate = invocation.data.vs === undefined ? whatToUpdate : whatToUpdate + "vs = :vs,";
                whatToUpdate = invocation.data.paidPost === undefined ? whatToUpdate : whatToUpdate + "paidPost = :pp,";
                whatToUpdate = invocation.data.actualPost === undefined ? whatToUpdate : whatToUpdate + "actualPost = :ap,";
                whatToUpdate = invocation.data.dateOfSent === undefined ? whatToUpdate : whatToUpdate + "dateOfSent = :dos,";
                whatToUpdate = whatToUpdate.substring(0, whatToUpdate.length - 1);
                let params = {
                    TableName: "objednavky",
                    Key:{
                        "id": invocation.data.id,
                        "userId": username
                    },
                    UpdateExpression: whatToUpdate,
                    ExpressionAttributeNames: {
                        "#i": "item",
                        "#n": "name"
                    },
                    ExpressionAttributeValues: {
                        ":adr": invocation.data.address,
                        ":am": invocation.data.amount,
                        ":dop": invocation.data.dateOfPay,
                        ":em": invocation.data.email,
                        ":ip": invocation.data.isPaid,
                        ":is": invocation.data.isSent,
                        ":it": invocation.data.item,
                        ":nam": invocation.data.name,
                        ":vs": invocation.data.vs,
                        ":pp": invocation.data.paidPost,
                        ":ap": invocation.data.actualPost,
                        ":dos": invocation.data.dateOfSent
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                docClient.update(params, (err, data) => {
                    if (err) {
                        invocation.errorHandler(err);
                    } else {
                        items = items.map(i => invocation.data.id === i.id ? invocation.data : i);
                        invocation.successHandler(invocation.items);
                    }
                });
            }
        },
        
        removeItem: invocation => {
            let params = {
                TableName: "objednavky",
                Key:{
                    "id": invocation.data.id,
                    "userId": username
                }
            };
            docClient.delete(params, (err, data) => {
                if (err) {
                    invocation.errorHandler(err);
                } else {
                    items = items.filter(i => i.id !== invocation.data.id);
                    invocation.successHandler(items);
                }
            });
        },
        
        logout: () => {
            AWS.config.credentials.clearCachedId();
            user.signOut();
        }
    });
}