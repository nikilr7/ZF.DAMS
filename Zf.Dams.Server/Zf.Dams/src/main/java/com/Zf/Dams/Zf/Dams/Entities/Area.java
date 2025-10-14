package com.Zf.Dams.Zf.Dams.Entities;

import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.*;

@Entity
public class Area extends SuperEntity
{
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
