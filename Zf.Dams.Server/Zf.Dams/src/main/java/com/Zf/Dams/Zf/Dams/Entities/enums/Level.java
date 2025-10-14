package com.Zf.Dams.Zf.Dams.Entities.enums;

import org.springframework.stereotype.Component;

@Component
public class Level 
{	
	public static String Level(String num)
    {
    	switch(num)
    	{
    	case "1":return "CB";
    	case "2":return "TL";
    	case "3":return "FH";
    	case "4":return "DH";
    	}
    	return "JMC";
    }
}
