package com.Zf.Dams.Zf.Dams.Entities;

import java.time.LocalDateTime;

import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.Entity;

@Entity
public class Log extends SuperEntity
{
private LocalDateTime timestamp;
private Machine machine;
private Activity activity;
private Employee employee;
private Boolean status;
private Float value;
private String image;
private String reason;
private String remarks;
private Float duration;
public LocalDateTime getTimestamp() {
	return timestamp;
}
public void setTimestamp(LocalDateTime timestamp) {
	this.timestamp = timestamp;
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
public Employee getEmployee() {
	return employee;
}
public void setEmployee(Employee employee) {
	this.employee = employee;
}
public Boolean getStatus() {
	return status;
}
public void setStatus(Boolean status) {
	this.status = status;
}
public Float getValue() {
	return value;
}
public void setValue(Float value) {
	this.value = value;
}
public String getImage() {
	return image;
}
public void setImage(String image) {
	this.image = image;
}
public String getReason() {
	return reason;
}
public void setReason(String reason) {
	this.reason = reason;
}
public String getRemarks() {
	return remarks;
}
public void setRemarks(String remarks) {
	this.remarks = remarks;
}
public Float getDuration() {
	return duration;
}
public void setDuration(Float duration) {
	this.duration = duration;
}
}


