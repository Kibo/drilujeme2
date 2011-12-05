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
    		var sLst = _.sortBy( this.models, function( word ){ return word.get('gravity'); });    		    		    
    		sLst.reverse();
    		var sSLst = sLst.slice(0, pref.get('numberOfWords') );     		    		
    		this.reset( _.shuffle( sSLst ) )    		
    	}    	  
});