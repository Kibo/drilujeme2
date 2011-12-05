window.Preference = Backbone.Model.extend({
	
	defaults: {
	    "lang":		"cs",	   
	    "numberOfWords":	10,
	    "id":               1,
            "teacher":          "pirate"
	  },
	  
	  initialize: function(){		
		  var STORE_NAME = "cz.kibo.drilujeme2.preference";
		  var PREFERENCE = STORE_NAME + '-' + this.get("id");
		  this.localStorage = new Store( STORE_NAME );
		  		  		 	
		  if( localStorage.getItem( PREFERENCE ) ){			
			  this.set( JSON.parse( localStorage.getItem( PREFERENCE )));			  
		  }	
		  
		  this.bind("change", function() {
			  this.save();		
		  });		  		 		  	
	  },
	  
	  dictionary: new Store( "cz.kibo.drilujeme2.dictionary" )
	  	  		 
});