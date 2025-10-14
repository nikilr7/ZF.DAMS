package com.Zf.Dams.Zf.Dams.Entities;

import java.util.List;

import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Machine extends SuperEntity
{
private String name;
private Cell cell;
private Family family;
@OneToMany
private List<Revision> revision;
private String image;
private String documentId;
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public Cell getCell() {
	return cell;
}
public void setCell(Cell cell) {
	this.cell = cell;
}
public Family getFamily() {
	return family;
}
public void setFamily(Family family) {
	this.family = family;
}
public List<Revision> getRevision() {
	return revision;
}
public void setRevision(List<Revision> revision) {
	this.revision = revision;
}
public String getImage() {
	return image;
}
public void setImage(String image) {
	this.image = image;
}
public String getDocumentId() {
	return documentId;
}
public void setDocumentId(String documentId) {
	this.documentId = documentId;
}
}

