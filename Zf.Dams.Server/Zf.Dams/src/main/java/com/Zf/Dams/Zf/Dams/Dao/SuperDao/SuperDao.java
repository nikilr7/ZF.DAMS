package com.Zf.Dams.Zf.Dams.Dao.SuperDao;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;

import com.Zf.Dams.Zf.Dams.Repository.ActivityRepository;

import jakarta.persistence.MappedSuperclass;

public class SuperDao<R extends CrudRepository<T, ID>, T, ID>
{
	public R repos;
	
	public SuperDao(R repos)
	{
		this.repos=repos;
	}
	
	public T saveData(T data)
	{
		return repos.save(data);
	}
	
	public Iterable<T> findAllData()
	{
		return repos.findAll();
	}
	
	public Optional<T> findById(ID id)
	{
		return repos.findById(id);
	}
	
	@ResponseBody
	public String DeleteData(T data)
	{
		repos.delete(data);
		return "Deleted Successfully";
	}
}
