async function insertAddress(params, logger, connection) {
    try {
        const { user_id, street_address, city, state, postal_code, country, address_type, is_default } = params;

        const [results] = await connection.query(
            'INSERT INTO Address (user_id, street_address, city, state, postal_code, country, address_type, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, street_address, city, state, postal_code, country, address_type, is_default]
        );
        logger.info(results);
        return results;
    } catch (error) {
        logger.info(error);
       throw error;
    }
}

async function updateAddress(params, logger, connection) {
    try {
        const { address_id, user_id, street_address, city, state, postal_code, country, address_type, is_default } = params;

        await connection.query(
            'UPDATE Address SET user_id = ?, street_address = ?, city = ?, state = ?, postal_code = ?, country = ?, address_type = ?, is_default = ? WHERE address_id = ?',
            [user_id, street_address, city, state, postal_code, country, address_type, is_default, address_id]
        );
        return true;
    } catch (error) {
        logger.error(error)
        throw error;
    }
}

// Function to view an address
async function viewAddress(params, logger, connection) {
    try {

        let query = 'SELECT * FROM Address WHERE ';
        let queryQrams = [];
        if(params.address_id ){
            query = query + ' address_id = ? ;';
            queryQrams = [params.address_id];

        }else{
            query = query + ' user_id = ? ;'
            queryQrams = [prams.user_id];
        }
    
        
        const [rows] = await connection.query(query, queryQrams);

        
        return rows;
    } catch (error) {
        logger.error(error)
        throw error;
    }
}

exports.generate_otp = async (params, logger, connection) => {
    try {
        // get user
        //if new user then create user
        //validate mobile 
        //generate otp
        //set otp in DB when we starting use of redis setting otp in db will discontinue whith expiry
        // send otp to user througn whats app,sms,if email is present then use email

        let isNewUser = false;
        const isUserPresent = "select user_id FROM user_details where mobile = ? AND is_deleted = 0;";
        let queryParams = [params.mobile];
        let [result] = await connection.query(isUserPresent, queryParams);
        let otp = Math.random().toString().slice(2, 8);
        let otpExp = new Date().valueOf() + 300000;
        logger.info({ mobile: params.mobile, otp, otpExp, result });
        if (result?.[0]?.user_id) {
            const isUserPresent = "UPDATE user_details SET otp = ?, otp_exp= ? where user_id = ?;";
            queryParams = [otp, otpExp, result[0].user_id];
            await connection.query(isUserPresent, queryParams);
        } else {
            isNewUser = true;
            const isUserPresent = "INSERT INTO user_details(mobile,otp,otp_exp,type) values(?,?,?,?);";
            queryParams = [params.mobile, otp, otpExp, params.type];
            await connection.query(isUserPresent, queryParams);
        }
        return [{
            isNewUser, otp, otpExp
        }]
    } catch (error) {
        logger.info({ params, error });
        throw error;
    }
};

exports.verify_otp = async (params, logger, connection) => {
    try {
        let generateAccessToken = require("../validations/auth").generateAccessToken
        const isUserPresent = "select user_id,name,otp,otp_exp,mobile FROM user_details where mobile = ? AND is_deleted = 0;";
        let queryParams = [params.mobile];
        let [result] = await connection.query(isUserPresent, queryParams);
        let nowDateValue = new Date().valueOf();
        logger.info({ result,params });

        if (result.length > 0 && result[0].otp == params.otp && nowDateValue < result[0].otp_exp) {
            let tokenParams = {
                user_id:result[0].user_id,
                mobile:result[0].mobile,
                type:result[0].type,
                name:result[0].name
            }
            let token = generateAccessToken(tokenParams,logger);
            logger.info(token);
            await connection.query('UPDATE user_details set otp = null, otp_exp = null where user_id = ?', [result[0].user_id]);
            return [{token}];
        }
        return [];
    } catch (error) {
        logger.info({ params, error });
        throw error;
    }
}

exports.address = async(params, logger, connection,authData) => {
    params.user_id = authData.user_id;
    if (params.type === 'insert') {
        await insertAddress(params, logger, connection);
    } else if (params.type === 'update') {
        await updateAddress(params, logger, connection);
    } else if (params.type === 'view') {
        await viewAddress(params, logger, connection);
    }
};