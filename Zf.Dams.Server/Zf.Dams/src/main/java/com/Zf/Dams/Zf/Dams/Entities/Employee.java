package com.Zf.Dams.Zf.Dams.Entities;

import com.Zf.Dams.Zf.Dams.Entities.enums.Level;
import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.*;

@Entity
public class Employee extends SuperEntity
{
	private String name;
	
	private String email;
	
	private String maintenanace;
	
	private String production;
	



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}



	public String getMaintenanace() {
		return Level.Level(maintenanace);
	}



	public void setMaintenanace(String maintenanace) {
		this.maintenanace = Level.Level(maintenanace);
	}



	public String getProduction() {
		return Level.Level(production);
	}



	public void setProduction(String production) {
		this.production = Level.Level(production);
	}
}
