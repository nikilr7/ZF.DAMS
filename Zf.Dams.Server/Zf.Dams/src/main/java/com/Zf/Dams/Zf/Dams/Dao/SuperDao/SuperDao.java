package com.Zf.Dams.Zf.Dams.Dao.SuperDao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.ResponseBody;


public class SuperDao<R extends JpaRepository<T, ID>, T, ID>
{
	@Autowired
	private R repos;
	
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
