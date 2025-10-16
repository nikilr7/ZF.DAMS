package com.Zf.Dams.Zf.Dams.Helpers.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;

@ControllerAdvice
public class Id_Not_Found_Exception_Handling extends ResponseEntityExceptionHandler
{
	@ExceptionHandler(Id_Not_Found.class)
	public ResponseEntity<ResponseStructure<String>> handling(Id_Not_Found id)
	{
		ResponseStructure<String> str=new ResponseStructure<String>();
		str.setData(id.getMessage());
		str.setMessage("Id Not Found");
		str.setStatusCode(300);
		
		return new ResponseEntity<ResponseStructure<String>>(str,HttpStatus.NOT_FOUND);
	}
	
}
