package com.Zf.Dams.Zf.Dams.Helpers;

import java.util.List;

import org.springframework.http.HttpStatus;

public class Response<T>
{
	public ResponseStructure<T> ResponseStructure(T data,String status,Integer code)
	{
		
		ResponseStructure<T> resp=new ResponseStructure<T>();
		
		resp.setData(data);
		
		resp.setMessage(status);
		
		resp.setStatusCode(code);
		
		return resp;
	}
	
	public ResponseStructure<Iterable<T>> ResponseStructureList(Iterable<T> data,String status,Integer code)
	{
		
		ResponseStructure<Iterable<T>> resp=new ResponseStructure<Iterable<T>>();
		
		resp.setData(data);
		
		resp.setMessage(status);
		
		resp.setStatusCode(code);
		
		return resp;
	}
	
	
	public ResponseStructure<String> ResponseStructureDelete(String data,String status,Integer code)
	{
		
		ResponseStructure<String> resp=new ResponseStructure<String>();
		
		resp.setData(data);
		
		resp.setMessage(status);
		
		resp.setStatusCode(code);
		
		return resp;
	}
		
}
