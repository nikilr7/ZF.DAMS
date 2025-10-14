package com.Zf.Dams.Zf.Dams.Entities.enums;

import org.springframework.stereotype.Component;

@Component
public class TicketHold
{

public static String ticketAssignedType(String num)
{
switch (num)
{
case "1":return "Production";
}
return "Maintenance";
}

public static String ticketStatus(String num)
{
switch (num)
{
case "1":return "Open";
case "2":return "Closed";
}
return "Waiting";
}

}
