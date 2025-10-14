package com.Zf.Dams.Zf.Dams.Entities;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import com.Zf.Dams.Zf.Dams.Entities.enums.TicketHold;
import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Ticket extends SuperEntity
{
private String TicketNumber;
private LocalDateTime timestamp;
private LocalDateTime startTimestamp;
private LocalDateTime closeTimestamp;
private Machine machine;
private Activity activity;
@OneToMany
private List<Log> logs;
private Employee employee;
private String type;
private String  abnormality;
private String closeRemarks;
private String completeRemarks;
private String reassignRemarks;
private String status;
private Duration  duration;
private String remarks;
public String getTicketNumber() {
	return TicketNumber;
}
public void setTicketNumber(String ticketNumber) {
	TicketNumber = ticketNumber;
}
public LocalDateTime getTimestamp() {
	return timestamp;
}
public void setTimestamp(LocalDateTime timestamp) {
	this.timestamp = timestamp;
}
public LocalDateTime getStartTimestamp() {
	return startTimestamp;
}
public void setStartTimestamp(LocalDateTime startTimestamp) {
	this.startTimestamp = startTimestamp;
}
public LocalDateTime getCloseTimestamp() {
	return closeTimestamp;
}
public void setCloseTimestamp(LocalDateTime closeTimestamp) {
	this.closeTimestamp = closeTimestamp;
}
public Machine getMachine() {
	return machine;
}
public void setMachine(Machine machine) {
	this.machine = machine;
}
public Activity getActivity() {
	return activity;
}
public void setActivity(Activity activity) {
	this.activity = activity;
}
public List<Log> getLogs() {
	return logs;
}
public void setLogs(List<Log> logs) {
	this.logs = logs;
}
public Employee getEmployee() {
	return employee;
}
public void setEmployee(Employee employee) {
	this.employee = employee;
}
public String getType() {
	return TicketHold.ticketAssignedType(type);
}
public void setType(String type) {
	this.type = TicketHold.ticketAssignedType(type);
}
public String getAbnormality() {
	return abnormality;
}
public void setAbnormality(String abnormality) {
	this.abnormality = abnormality;
}
public String getCloseRemarks() {
	return closeRemarks;
}
public void setCloseRemarks(String closeRemarks) {
	this.closeRemarks = closeRemarks;
}
public String getCompleteRemarks() {
	return completeRemarks;
}
public void setCompleteRemarks(String completeRemarks) {
	this.completeRemarks = completeRemarks;
}
public String getReassignRemarks() {
	return reassignRemarks;
}
public void setReassignRemarks(String reassignRemarks) {
	this.reassignRemarks = reassignRemarks;
}
public String getStatus() {
	return TicketHold.ticketStatus(status);
}
public void setStatus(String status) {
	this.status = TicketHold.ticketStatus(status);
}
public Duration getDuration() {
	return duration;
}
public void setDuration(Duration duration) {
	this.duration = duration;
}
public String getRemarks() {
	return remarks;
}
public void setRemarks(String remarks) {
	this.remarks = remarks;
}


}