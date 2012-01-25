window.WordList = Backbone.Collection.extend({
		
	model: Word,
	
	initialize: function(){			
		this.preference = new Preference(); 
		this.localStorage = this.preference.dictionary;    		    		    
		this.fetch();   
		this.prepare();    		
	},
	    	    
	prepare:function(){  		
		var pref = this.preference;
                var lst =  this.filter(function( word ){ return word.get('published') }); 
                var sLst = _.sortBy( lst , function( word ){ return word.get('published'); });  							
		var sSLst = sLst.slice(0, pref.get('numberOfWords') ); 			
		this.reset( _.shuffle( sSLst ) );
	}    	  
});

