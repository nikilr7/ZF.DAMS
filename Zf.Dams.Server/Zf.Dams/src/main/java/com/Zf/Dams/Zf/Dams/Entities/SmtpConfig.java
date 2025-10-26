package com.Zf.Dams.Zf.Dams.Entities;

import jakarta.persistence.Entity;
import java.lang.*;

import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

@Entity
public class SmtpConfig extends SuperEntity
{
private String server;
private Integer port;
private boolean useSSL;
private String password;
private String fromEmail;
private String fromName;
public String getServer() {
	return server;
}
public void setServer(String server) {
	this.server = server;
}
public Integer getPort() {
	return port;
}
public void setPort(Integer port) {
	this.port = port;
}
public Boolean getUseSSL() {
	return useSSL;
}
public void setUseSSL(Boolean useSSL) {
	this.useSSL = useSSL;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}
public String getFromEmail() {
	return fromEmail;
}
public void setFromEmail(String fromEmail) {
	this.fromEmail = fromEmail;
}
public String getFromName() {
	return fromName;
}
public void setFromName(String fromName) {
	this.fromName = fromName;
}



}