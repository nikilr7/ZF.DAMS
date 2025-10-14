package com.Zf.Dams.Zf.Dams.Entities;

import java.time.LocalDateTime;

import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.*;

@Entity
public class Activity extends SuperEntity
{	
	private Machine machine;
	private Family family;
	private Integer type;
	private String sequence;
	private String instruction;
	private String image;
	private String frequency;
	private Float minimum;
	private Float maximum;
	private String units;
	private Boolean active;
	private LocalDateTime createdTimeStamp;
	private LocalDateTime removedTimeStamp;
	private Boolean isImageCompressed;

	public Machine getMachine() {
		return machine;
	}
	public void setMachine(Machine machine) {
		this.machine = machine;
	}
	public Family getFamily() {
		return family;
	}
	public void setFamily(Family family) {
		this.family = family;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getSequence() {
		return sequence;
	}
	public void setSequence(String sequence) {
		this.sequence = sequence;
	}
	public String getInstruction() {
		return instruction;
	}
	public void setInstruction(String instruction) {
		this.instruction = instruction;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getFrequency() {
		return frequency;
	}
	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}
	public Float getMinimum() {
		return minimum;
	}
	public void setMinimum(Float minimum) {
		this.minimum = minimum;
	}
	public Float getMaximum() {
		return maximum;
	}
	public void setMaximum(Float maximum) {
		this.maximum = maximum;
	}
	public String getUnits() {
		return units;
	}
	public void setUnits(String units) {
		this.units = units;
	}
	public Boolean getActive() {
		return active;
	}
	public void setActive(Boolean active) {
		this.active = active;
	}
	public LocalDateTime getCreatedTimeStamp() {
		return createdTimeStamp;
	}
	public void setCreatedTimeStamp(LocalDateTime createdTimeStamp) {
		this.createdTimeStamp = createdTimeStamp;
	}
	public LocalDateTime getRemovedTimeStamp() {
		return removedTimeStamp;
	}
	public void setRemovedTimeStamp(LocalDateTime removedTimeStamp) {
		this.removedTimeStamp = removedTimeStamp;
	}
	public Boolean getIsImageCompressed() {
		return isImageCompressed;
	}
	public void setIsImageCompressed(Boolean isImageCompressed) {
		this.isImageCompressed = isImageCompressed;
	}
	
}
