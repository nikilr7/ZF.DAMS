package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.MachineDao;
import com.Zf.Dams.Zf.Dams.Dao.RevisionDao;
import com.Zf.Dams.Zf.Dams.Entities.Machine;
import com.Zf.Dams.Zf.Dams.Entities.Revision;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class RevisionService 
{
	@Autowired
	private RevisionDao dao;
	
	@Autowired
	Response<Revision> response;
	
	public ResponseEntity<ResponseStructure<Revision>> savedata(Revision data)
	{
		Revision save= dao.saveData(data);
		ResponseStructure<Revision> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Revision>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Revision>>> findAllData()
	{
		Iterable<Revision> list=dao.findAllData();
		ResponseStructure<Iterable<Revision>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Revision>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Revision>> findById(Integer id)
	{
		Optional<Revision> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Revision> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Revision>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Revision> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Revision>> UpdateData(Revision data)
	{
		Optional<Revision> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Revision update= dao.saveData(data);
			
			ResponseStructure<Revision> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Revision>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
