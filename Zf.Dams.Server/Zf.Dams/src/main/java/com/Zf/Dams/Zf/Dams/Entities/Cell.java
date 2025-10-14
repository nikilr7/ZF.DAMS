package com.Zf.Dams.Zf.Dams.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.*;

@Entity
public class Cell
{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String number;
	private String name;
	private Area area;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Area getArea() {
		return area;
	}
	public void setArea(Area area) {
		this.area = area;
	}
	@Override
	public String toString() {
		return "Cell [number=" + number + ", name=" + name + ", area=" + area + "]";
	}
	
	
}
