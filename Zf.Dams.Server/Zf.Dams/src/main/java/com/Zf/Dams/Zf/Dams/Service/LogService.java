package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.LogDao;
import com.Zf.Dams.Zf.Dams.Entities.Log;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class LogService 
{
	@Autowired
	private LogDao dao;
	
	@Autowired
	Response<Log> response;
	
	public ResponseEntity<ResponseStructure<Log>> savedata(Log data)
	{
		Log save= dao.saveData(data);
		ResponseStructure<Log> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Log>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Log>>> findAllData()
	{
		Iterable<Log> list=dao.findAllData();
		ResponseStructure<Iterable<Log>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Log>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Log>> findById(Integer id)
	{
		Optional<Log> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Log> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Log>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Log> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Log>> UpdateData(Log data)
	{
		Optional<Log> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Log update= dao.saveData(data);
			
			ResponseStructure<Log> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Log>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
