package com.Zf.Dams.Zf.Dams.Entities;

import com.Zf.Dams.Zf.Dams.Entities.enums.CellClaimType;
import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.*;

@Entity
public class CellClaim extends SuperEntity
{
	
	private Cell cell;
	
	private Employee employee;
	
	private String type;

	public Cell getCell() {
		return cell;
	}

	public void setCell(Cell cell) {
		this.cell = cell;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public String getType() {
		return CellClaimType.cellClaimType(type);
	}

	public void setType(String type) {
		this.type =CellClaimType.cellClaimType(type);
	}	
}

