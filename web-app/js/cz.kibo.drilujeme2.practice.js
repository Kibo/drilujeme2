$(function(){				
    window.Practice = Backbone.View.extend({
    	el: $("#practice-page"),
    	    	    	    
    	initialize: function(){
    		this.preference = new Preference();  
    		this.render();
                this.$(".practice-test-type-radio[value='" + this.preference.get('teacher') + "']").attr('checked', 'checked');
    	},
    	
    	events:{    		
    		"change #practice-numberOfWords": "updatePreference", 
                "change .practice-test-type-radio": "updatePreference", 
    		"click #practice-start-button": "start"		    		    
    	},
                	
    	start:function(){    	
    		window.location.replace('practice_' +  this.$(".practice-test-type-radio:checked").val()  + '.html')    	
    	},
    	
    	updatePreference:function( event ){
    		this.preference.set({ "numberOfWords":  parseInt(this.$('#practice-numberOfWords').val()), "teacher": this.$(".practice-test-type-radio:checked").val() });    		
    	},
    	        	    	        
    	render:function(){
            this.$('#practice-numberOfWords').val(  this.preference.get('numberOfWords') );    	
            return this;  		
    	}    	    	      
    });
    
    window.practice  = new Practice;		    
}); 

