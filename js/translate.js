/* 
    HTML and JS Translation Module
    Authour         : Sandupa Santhusha Dalugoda
    Date Created    : 9/12/2017
    Limitations     : 
                        *   getTranslation(key) cannot apply to Function called on the bodyonload
                        *   Not supporting for <title> tag

*/

//Settings
var sup_lang = ['en','si']; //Supporting Languages
var def_lang = "en"; //Default Language

//Read a File
function readFile(file, callback) 
{
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () 
    {
        if (rawFile.readyState === 4 && rawFile.status == "200") 
        {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//Set Browser Cookie
function setCookie(cname, cvalue, exdays) 
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//Get Browser Cookie
function getCookie(cname) 
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) 
    {
        var c = ca[i];
        while (c.charAt(0) == ' ') 
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) 
        {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) 
{
    var objects = [];
    for (var i in obj) 
    {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') 
        {

            objects = objects.concat(getObjects(obj[i], key, val));
        } 
        else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') 
            { //
                objects.push(obj);
            } 
            else if (obj[i] == val && key == '') 
            {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) 
{
    var objects = [];
    for (var i in obj) 
    {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') 
        {
            objects = objects.concat(getValues(obj[i], key));
        } 
        else if (i == key) 
        {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) 
{
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') 
        {
            objects = objects.concat(getKeys(obj[i], val));
        } 
        else if (obj[i] == val) 
        {
            objects.push(i);
        }
    }
    return objects;
}

//Check value is in array
function isInArray(value, array) 
{
    return array.indexOf(value) > -1;
}

//Initial Variables
var data;
var lang     = getCookie("lang");
var spans = document.getElementsByTagName("span");

//Check Language Setted or not
if(!isLanguageSetted())
    setLanguage(def_lang);

//Loading Language File
readFile("js/translations.json", function (text) 
{
    data = JSON.parse(text);

    for (var i = 0; i < spans.length; i++) 
    {
        var elem_id = spans[i].id;

        if (elem_id.indexOf('trl_') == 0) 
        {
            var tras_id = elem_id.substr(4);
            //Replacing Content
            document.getElementById(elem_id).innerHTML = data[lang][tras_id];
        }
    }
});

//Return translations for scripts
function getTranslation(key)
{
    return data[lang][key];
}

//Set Language Cookie
function setLanguage(language)
{
    if (isInArray(language, sup_lang)==true) 
    {
        lang = language;
        setCookie("lang", language, 30);
    }
}

//Check Language cookies set or not
function isLanguageSetted()
{
    if (lang == "") 
        return false;
    else
        return true;
}

//Switch Language (Reload after set)
function switchLanguage(lang)
{
    setLanguage(lang);
    location.reload();
}

