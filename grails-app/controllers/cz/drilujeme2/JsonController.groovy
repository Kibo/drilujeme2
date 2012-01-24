package cz.drilujeme2

import grails.converters.*;

class JsonController {
    
    static def apiKey = '81f743eeb678208f1ee80099470d51ec'
    static def COUNT_OF_IMAGES = 30

    def translate = {                      
        def query =  URLEncoder.encode(params.q)
      
        /*
        * http://www.google.com/dictionary/json?callback=data&q=leave&sl=en&tl=cs&restrict=pr,re
        * pr - primaries
        * re - related
        * de - definition
        * sy - synonyms //must be in en language
        */
        def TRANSLATE_SEARCH_BASE_URL = "http://www.google.com/dictionary/json?callback=data"+
            "&q=${query}"+
            "&sl=en"+
            "&tl=en"+
            "&restrict=pr";

        def url = new URL( TRANSLATE_SEARCH_BASE_URL )             
        def text = url.getText("utf-8")
                      
        def gjson = JSON.parse( text.substring( text.indexOf("{") , (text.lastIndexOf("}") + 1)))
      
        def snd    
        def stat = 'ok'
        try{         
            def lastItem = gjson.primaries.terms.text.last()                   
            snd = lastItem.last() 
                                    
            if(gjson.sourceLanguage != 'en'){              
                stat = 'error' 
            }

        }catch(NullPointerException e){             
            stat = 'error'  
        }

        //response.addHeader("Content-Disposition", "attachment; filename=traslate.json")   
        render(contentType:"text/json") {
               term  = params.q	            
               sound = snd         
               status = stat
        }        
    }
    
    def photos = {       
        def query = URLEncoder.encode(params.q)                  
        response.setContentType("text/json")
        response.addHeader("Content-Disposition", "attachment; filename=images.json")
        render getPhotoJson( query )
        return               
    }
    
    def getPhotoJson( query ){
        def url = getStrongUrl( query )      
        
        def json = JSON.parse( url.getText("utf-8") )
        if( json.photos.total == '0'  ){
            url = getCarelessUrl( query )
        }
        return url.getText("utf-8")
    }
    
    def getStrongUrl( query ){                        
        def FLICKR_URL = "http://api.flickr.com/services/rest/?method=flickr.photos.search" + 
                        "&sort=interestingness-desc"+
                        "&license=4,5,6,7" + 
                        "&safe_search=1"+
                        "&content_type=7" +
                        "&media=photos" +			
                        "&per_page=${COUNT_OF_IMAGES}"+
                        "&page=1"+
                        "&format=json"+
                        "&nojsoncallback=1"+
                        "&api_key=${apiKey}"+     	
                        "&tags=${query}";
        
        return new URL( FLICKR_URL )        
    }
    
    def getCarelessUrl( query ){
        def FLICKR_URL = "http://api.flickr.com/services/rest/?method=flickr.photos.search" + 
                        "&sort=interestingness-desc"+
                        "&license=4,5,6,7" + 
                        "&safe_search=1"+
                        "&content_type=7" +
                        "&media=photos" +			
                        "&per_page=${COUNT_OF_IMAGES}"+
                        "&page=1"+
                        "&format=json"+
                        "&nojsoncallback=1"+
                        "&api_key=${apiKey}"+  
                        "&tags=${query}"+
                        "&text=${query}";	
                        
        
        return new URL( FLICKR_URL )       
    }
              
}
