export function success(data, message="success"){

    return {

        success:true,

        data,

        message

    }

}



export function fail(message="error"){

    return {

        success:false,

        data:null,

        message

    }

}