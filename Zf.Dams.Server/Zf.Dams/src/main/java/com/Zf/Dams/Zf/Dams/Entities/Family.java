package com.Zf.Dams.Zf.Dams.Entities;

import java.util.List;

import com.Zf.Dams.Zf.Dams.Entities.superEntity.SuperEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Family extends SuperEntity
{
private Integer id;
private String name;
@OneToMany
private List<Revision> revisions;
private String image;
public Integer getId() {
	return id;
}
public void setId(Integer id) {
	this.id = id;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public List<Revision> getRevisions() {
	return revisions;
}
public void setRevisions(List<Revision> revisions) {
	this.revisions = revisions;
}
public String getImage() {
	return image;
}
public void setImage(String image) {
	this.image = image;
}


}

