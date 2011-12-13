class UrlMappings {
    static mappings = {   
    
        //--INDEX-----------------
        //"/"(uri:"index.html")
    
        //--SEO------------------------------
        //"/sitemap.xml"(uri:"/sitemap.xml")
        //"/robots.txt" (uri:"/robots.txt")
        
        //--PAGES-----------------
        "/dictionary"(controller:"page", action:'dictionary')
        
        //--JSON-----------------       
        "/translate/$q" (controller:"json", action:'translate')
        "/photos/$q" (controller:"json", action:'photos')	                
    }
}
