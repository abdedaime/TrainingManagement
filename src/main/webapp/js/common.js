function encodeObjectData(object){
    return encodeURIComponent(JSON.stringify(object));
}

function generateRandomString(size){
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, size);
}

function isValidJson(object){
    try{
        JSON.parse(object);
    } catch(e){
        return false;
    }
    return true;
}

function isValidEmail(email){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function isAuthorized(user,entity,right){
    var defined = !user || !entity || !right;
        if(defined)
            return false;
    
    if(user.isSuperAdmin)
        return true;
  
    if(_.find(user.role.rights,{name:entity}))
    {   
        if(_.find(user.role.rights,{name:entity}).rights.indexOf(right)!=-1)
            return true;
    }
    
    return false;

}