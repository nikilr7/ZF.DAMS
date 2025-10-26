package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.ActivityDao;
import com.Zf.Dams.Zf.Dams.Entities.Activity;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class ActivityService 
{
	@Autowired
	private ActivityDao dao;
	
	@Autowired
	Response<Activity> response;
	
	public ResponseEntity<ResponseStructure<Activity>> savedata(Activity data)
	{
		Activity save= dao.saveData(data);
		ResponseStructure<Activity> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Activity>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Activity>>> findAllData()
	{
		Iterable<Activity> list=dao.findAllData();
		ResponseStructure<Iterable<Activity>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Activity>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Activity>> findById(Integer id)
	{
		Optional<Activity> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Activity> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Activity>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Activity> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Activity>> UpdateData(Activity data)
	{
		Optional<Activity> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Activity update= dao.saveData(data);
			
			ResponseStructure<Activity> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Activity>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
