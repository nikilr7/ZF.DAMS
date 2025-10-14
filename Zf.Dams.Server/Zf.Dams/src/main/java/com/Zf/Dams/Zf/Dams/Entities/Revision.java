package com.Zf.Dams.Zf.Dams.Entities;

import java.time.LocalDateTime;

import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.Entity;

@Entity
public class Revision extends SuperEntity
{
private LocalDateTime timestamp;

public LocalDateTime getTimestamp() {
	return timestamp;
}

public void setTimestamp(LocalDateTime timestamp) {
	this.timestamp = timestamp;
}


}
