package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.MachineDao;
import com.Zf.Dams.Zf.Dams.Entities.Machine;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class MachineService 
{
	@Autowired
	private MachineDao dao;
	
	@Autowired
	Response<Machine> response;
	
	public ResponseEntity<ResponseStructure<Machine>> savedata(Machine data)
	{
		Machine save= dao.saveData(data);
		ResponseStructure<Machine> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Machine>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Machine>>> findAllData()
	{
		Iterable<Machine> list=dao.findAllData();
		ResponseStructure<Iterable<Machine>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Machine>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Machine>> findById(Integer id)
	{
		Optional<Machine> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Machine> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Machine>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Machine> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Machine>> UpdateData(Machine data)
	{
		Optional<Machine> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Machine update= dao.saveData(data);
			
			ResponseStructure<Machine> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Machine>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
