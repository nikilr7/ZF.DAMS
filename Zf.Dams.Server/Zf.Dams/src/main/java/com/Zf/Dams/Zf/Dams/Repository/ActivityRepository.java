package com.Zf.Dams.Zf.Dams.Repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.Zf.Dams.Zf.Dams.Entities.Activity;

public interface ActivityRepository extends CrudRepository<Activity, Integer>
{
	List<Activity> getAllType();
}
