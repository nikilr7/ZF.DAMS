package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.CellDao;
import com.Zf.Dams.Zf.Dams.Dao.FamilyDao;
import com.Zf.Dams.Zf.Dams.Entities.Cell;
import com.Zf.Dams.Zf.Dams.Entities.Family;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class FamilyService 
{
	@Autowired
	private FamilyDao dao;
	
	@Autowired
	Response<Family> response;
	
	public ResponseEntity<ResponseStructure<Family>> savedata(Family data)
	{
		Family save= dao.saveData(data);
		ResponseStructure<Family> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Family>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Family>>> findAllData()
	{
		Iterable<Family> list=dao.findAllData();
		ResponseStructure<Iterable<Family>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Family>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Family>> findById(Integer id)
	{
		Optional<Family> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Family> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Family>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Family> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Family>> UpdateData(Family data)
	{
		Optional<Family> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Family update= dao.saveData(data);
			
			ResponseStructure<Family> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Family>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
