package com.example.controller;


import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.JeanRecordRepository;
import com.example.dao.JeansRepository;
import com.example.dao.PacRecordRepository;
import com.example.dao.PositionRepository;
import com.example.dao.ShelfRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_jearecord;
import com.example.module.Tb_position;
import com.example.module.Tb_shelf;

import net.sf.json.JSONObject;

@Controller
public class Home {

	@Autowired
	PacRecordRepository pacRecordRepository;
	@Autowired
	JeansRepository jeansRepository;
	@Autowired
	PositionRepository positionRepository;
	@Autowired	
	ShelfRepository shelfRepository;
	@Autowired
	JeanRecordRepository jeanRecordRepository;
	
	
	@RequestMapping("/home/backDefaultTimeSection")
	@ResponseBody
	public  JSONObject backDefaultTimeSection() {
		
		JSONObject jsonoBDTS = new JSONObject();
		java.util.Date date;
		//数据格式转换
		SimpleDateFormat bartDateFormat =  new SimpleDateFormat("yyyy-MM-dd");
		
		//返回今日的日期
		java.util.Date now=new java.util.Date();
		String XDate=bartDateFormat.format(now.getTime());
		
		//今年
		String thisyear = XDate.substring(0,4);
		
		
		//返回每月
		JSONObject barMonth = new JSONObject();
		List<Integer> InMonth = new ArrayList<Integer>();
		List<Integer> OutMonth = new ArrayList<Integer>();
		for(int i=1;i<13;i++){
		String dateStringToParse1 = thisyear+"-"+i+"-1";
		String dateStringToParse2 = thisyear+"-"+(i+1)+"-0";
	       try {  		    	   
	        date = bartDateFormat.parse(dateStringToParse1);  
	        Timestamp date1 = new Timestamp(date.getTime());
	        date = bartDateFormat.parse(dateStringToParse2);  
	        Timestamp date2 = new Timestamp(date.getTime());
	        
	        List<Tb_jearecord> tb_jearecords = jeanRecordRepository.InAountMonth(date1, date2);
	        int a = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	a = a + tb_jearecord.getNowNum();
	        }
	        InMonth.add(a);
	        
	        tb_jearecords = jeanRecordRepository.OutAountMonth(date1, date2);
	        int b = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	b = b + tb_jearecord.getNowNum();
	        }
	        OutMonth.add(b);
	        
	       }  
	       catch (Exception ex) {  
	        System.out.println(ex.getMessage());  
	       }	
		}  
		barMonth.put("InMonth", InMonth);
		barMonth.put("OutMonth", OutMonth);
		barMonth.put("thisyear", thisyear);
		jsonoBDTS.put("bar", barMonth);

		//返回仓库用量(未测试)	   
    	int myVolume =0;
		int myOccupation=0;
		List<Tb_shelf> listShelf = shelfRepository.findAll();
		for(Tb_shelf tb_shelf:listShelf){
			String myShelfNum = tb_shelf.getShelfNumber();
			List<Tb_position> listPosition = positionRepository.backAllPos(myShelfNum);
			for(Tb_position tb_position:listPosition){
				myVolume = tb_position.getVolume()+myVolume;
				myOccupation = tb_position.getOccupation()+myOccupation;				
			}
		}
    	jsonoBDTS.put("myOccupation",myOccupation);
    	jsonoBDTS.put("myVolume",myVolume);
			
		
		//返回最近12天
		JSONObject areaspline = new JSONObject();
		
		List<Integer> InDay = new ArrayList<Integer>();
		List<Integer> OutDay = new ArrayList<Integer>();
		
		for(long i=0;i<12;i++){
		String datenow_1=bartDateFormat.format(new Date(now.getTime() - (i-1) * 24 * 60 * 60 * 1000));
		String datenow_2=bartDateFormat.format(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
		try {
			date = bartDateFormat.parse(datenow_1);
			Timestamp date1 = new Timestamp(date.getTime());
			date = bartDateFormat.parse(datenow_2);
			Timestamp date2 = new Timestamp(date.getTime());
			
			List<Tb_jearecord> tb_jearecords = jeanRecordRepository.InAountDay(date2, date1);
	        int a = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	a = a + tb_jearecord.getNowNum();
	        }
	        InDay.add(a);
	        
	        tb_jearecords = jeanRecordRepository.OutAountDay(date2, date1);
	        int b = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	b = b + tb_jearecord.getNowNum();
	        }
	        OutDay.add(b);
	        
			} catch (ParseException e) {e.printStackTrace();}  		
		}
		areaspline.put("InDay", InDay);
		areaspline.put("OutDay", OutDay);
		areaspline.put("XDate", XDate);
		jsonoBDTS.put("areaspline", areaspline);
				
		return jsonoBDTS;
	}
	
	@RequestMapping("/home/backSelectTimeSection")
	@ResponseBody
	public  JSONObject backSelectTimeSection(@RequestParam(value="beginDate") String beginDate,
			@RequestParam(value="endDate") String endDate){
		JSONObject jsonoBDTS = new JSONObject();
		java.util.Date date;
		//数据格式转换
		SimpleDateFormat bartDateFormat =  new SimpleDateFormat("yyyy-MM-dd");
		
		//截取截止年限年份
		String thisyear = endDate.substring(0, 4);
		
		//返回每月
		JSONObject barMonth = new JSONObject();
		List<Integer> InMonth = new ArrayList<Integer>();
		List<Integer> OutMonth = new ArrayList<Integer>();
		for(int i=1;i<13;i++){
		String dateStringToParse1 = thisyear+"-"+i+"-1";
		String dateStringToParse2 = thisyear+"-"+(i+1)+"-0";
	       try {  		    	   
	        date = bartDateFormat.parse(dateStringToParse1);  
	        Timestamp date1 = new Timestamp(date.getTime());
	        date = bartDateFormat.parse(dateStringToParse2);  
	        Timestamp date2 = new Timestamp(date.getTime());
	        
	        
	        List<Tb_jearecord> tb_jearecords = jeanRecordRepository.InAountMonth(date1, date2);
	        int a = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	a = a + tb_jearecord.getNowNum();
	        }
	        InMonth.add(a);
	        
	        tb_jearecords = jeanRecordRepository.OutAountMonth(date1, date2);
	        int b = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	b = b + tb_jearecord.getNowNum();
	        }
	        OutMonth.add(b);
	        
	       }  
	       catch (Exception ex) {  
	        System.out.println(ex.getMessage());  
	       }	
		}  
		barMonth.put("InMonth", InMonth);
		barMonth.put("OutMonth", OutMonth);
		barMonth.put("thisyear", thisyear);
		jsonoBDTS.put("bar", barMonth);

		//返回仓库用量(未测试)	   
    	int myVolume =0;
		int myOccupation=0;
		List<Tb_shelf> listShelf = shelfRepository.findAll();
		for(Tb_shelf tb_shelf:listShelf){
			String myShelfNum = tb_shelf.getShelfNumber();
			List<Tb_position> listPosition = positionRepository.backAllPos(myShelfNum);
			for(Tb_position tb_position:listPosition){
				myVolume = tb_position.getVolume()+myVolume;
				myOccupation = tb_position.getOccupation()+myOccupation;				
			}
		}
    	jsonoBDTS.put("myOccupation",myOccupation);
    	jsonoBDTS.put("myVolume",myVolume);
		
		
		//返回查询需要的时间段
		JSONObject areaspline = new JSONObject();
		java.util.Date beginDate1; 
		java.util.Date endDate1; 
		int days;
		List<Integer> InDay = new ArrayList<Integer>();
		List<Integer> OutDay = new ArrayList<Integer>();
		
		try {
			 beginDate1 = bartDateFormat.parse(beginDate);
			 endDate1 = bartDateFormat.parse(endDate);
			 days = ((int)(endDate1.getTime()/1000)-(int)(beginDate1.getTime()/1000))/3600/24; 
			 System.out.println(days);
		
		for(long i=0;i<(days+1);i++){
		String datenow_1=bartDateFormat.format(new Date(endDate1.getTime() - (i-1) * 24 * 60 * 60 * 1000));
		String datenow_2=bartDateFormat.format(new Date(endDate1.getTime() - i * 24 * 60 * 60 * 1000));
		try {
			date = bartDateFormat.parse(datenow_1);
			Timestamp date1 = new Timestamp(date.getTime());
			date = bartDateFormat.parse(datenow_2);
			Timestamp date2 = new Timestamp(date.getTime());
			
			List<Tb_jearecord> tb_jearecords = jeanRecordRepository.InAountMonth(date2, date1);
	        int a = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	a = a + tb_jearecord.getNowNum();
	        }
	        InDay.add(a);
	        
	        tb_jearecords = jeanRecordRepository.OutAountMonth(date2, date1);
	        int b = 0;
	        for(Tb_jearecord tb_jearecord:tb_jearecords){
	        	b = b + tb_jearecord.getNowNum();
	        }
	        OutDay.add(b);
	        
			} catch (ParseException e) {e.printStackTrace();}  		
		}
		}
		catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		
		}
		System.out.println(InDay);
		System.out.println(OutDay);
		areaspline.put("InDay", InDay);
		areaspline.put("OutDay", OutDay);
		jsonoBDTS.put("areaspline", areaspline);
				
		return jsonoBDTS;
		
	}
	
	@RequestMapping("/home/backMoudelNumWeight")
	@ResponseBody
	public  JSONObject backMoudelNumWeight(@RequestParam(value="MoudelNum") String MoudelNum){
		//返回对象
		JSONObject jsonoBDTS = new JSONObject();
		
		List<Tb_jeans> tb_jeans = jeansRepository.findByModuleNum(MoudelNum);
		
		int tb_jeansNum = tb_jeans.size();//找到的相同moudelNum的数量
		float[] weight = new float[tb_jeansNum];//将每一包的重量放入其中
		float weightAverage = 0;
		float weightAmount = 0;
		for(int i=0;i<tb_jeansNum;i++){
			if(i<100){
				weight[i] = tb_jeans.get(tb_jeansNum-i-1).getJeaWeight();
				weightAmount = weightAmount + weight[i];
			}
		}
		
		if(tb_jeansNum>100){
			weightAverage=weightAmount/100;
		}else{
			if(tb_jeansNum != 0){
			weightAverage=weightAmount/tb_jeansNum;}
		}
		
		jsonoBDTS.put("weight", weight);
		jsonoBDTS.put("weightAverage", weightAverage);
		return jsonoBDTS;
	}
}
