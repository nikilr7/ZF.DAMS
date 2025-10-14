package com.Zf.Dams.Zf.Dams.Entities.enums;

import org.springframework.stereotype.Component;

@Component
	public class CellClaimType 
	{   
	    public static String cellClaimType(String num)
	    {
	    	switch(num)
	    	{
	    	case "1":return "Production";
	    	case "2":return "Maintenanace";
	    	case "3":return "Operator";
	    	case "4":return "Dashboard";
	    	}
	    	return "Tickets";
	    }
	}
	
