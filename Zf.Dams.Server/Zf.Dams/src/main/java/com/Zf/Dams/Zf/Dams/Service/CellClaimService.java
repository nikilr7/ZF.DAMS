package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.ActivityDao;
import com.Zf.Dams.Zf.Dams.Dao.cellclaimDao;
import com.Zf.Dams.Zf.Dams.Entities.Activity;
import com.Zf.Dams.Zf.Dams.Entities.CellClaim;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class CellClaimService 
{
	@Autowired
	private cellclaimDao dao;
	
	@Autowired
	Response<CellClaim> response;
	
	public ResponseEntity<ResponseStructure<CellClaim>> savedata(CellClaim data)
	{
		CellClaim save= dao.saveData(data);
		ResponseStructure<CellClaim> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<CellClaim>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<CellClaim>>> findAllData()
	{
		Iterable<CellClaim> list=dao.findAllData();
		ResponseStructure<Iterable<CellClaim>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<CellClaim>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<CellClaim>> findById(Integer id)
	{
		Optional<CellClaim> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<CellClaim> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<CellClaim>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<CellClaim> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<CellClaim>> UpdateData(CellClaim data)
	{
		Optional<CellClaim> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			CellClaim update= dao.saveData(data);
			
			ResponseStructure<CellClaim> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<CellClaim>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
