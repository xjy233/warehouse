package com.example.serviceimpl;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.JeanRecordRepository;
import com.example.dao.JeansRepository;
import com.example.dao.PacRecordRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_jearecord;
import com.example.module.Tb_package;
import com.example.module.Tb_pacrecord;
import com.example.service.PacRecordService;
import com.example.service.PackageService;

@Service
public class PacRecordServiceImpl implements PacRecordService{
	@Autowired
	private PacRecordRepository pacRecordRepository;
	@Autowired
	PackageService packageService;
	@Autowired
	JeanRecordRepository jeanRecordRepository;
	@Autowired
	JeansRepository jeansRepository;
	
	@Override
	public void add(Tb_pacrecord tb_pacrecord) {
		pacRecordRepository.save(tb_pacrecord);
	}

	@Override
	public void deleteById(int Id) {
		pacRecordRepository.delete(Id);
	}

	@Override
	public Tb_pacrecord findByPacID(String packageId) {
		return pacRecordRepository.findByPacID(packageId);
	}

	@Override
	public void addOutTime(String pacID, Timestamp outTime,String outUser) {
		pacRecordRepository.addTimeUser(pacID, outTime, outUser);
		
	}
	
	@Override
	public List<String> InOutRecordQuerySet(List<Tb_package> packages, List<Tb_jearecord> pacrecordsName,
			List<Tb_jearecord> pacrecordsTime) {
		List<Object> listjeans = new ArrayList<Object>();
		listjeans.add(packages);
		listjeans.add(pacrecordsName);
		listjeans.add(pacrecordsTime);
		//将packageId存入一个集合中
		List<String> list1 = new ArrayList<String>(); //LIST1为交集
		List<String> list2 = new ArrayList<String>();
		//得到交集，并把交集结果存入list1中
		System.out.println("kaishi:");
		getSet:
		for(int i=0;i<3;++i){
		
		if(i==0){
			List<Tb_package> mylist = (List<Tb_package>) listjeans.get(i);
		for(Tb_package tb_jeans:mylist)
		{list1.add(tb_jeans.getPackageID());}
		}else{
				list2 = new ArrayList<>();
				List<Tb_jearecord> mylist = (List<Tb_jearecord>) listjeans.get(i);
				if(mylist.isEmpty()){
					list1 = new ArrayList<>();
					break getSet;
				}
				for(Tb_jearecord tb_jearecord:mylist)
				{
					Tb_jeans jeansList = jeansRepository.findByJeansId(tb_jearecord.getJeansID());
					list2.add(jeansList.getPackageId());}
					list2.retainAll(list1);
					list1 = list2;
			}
		System.out.println(list1+""+i);
		}
		
		packageService.removeDuplicate(list1);
		return list1;
	}

	@Override
	public List<Tb_jearecord> InQueryTime(String time) throws ParseException {
		java.util.Date date;
		SimpleDateFormat bartDateFormat =  new SimpleDateFormat("yyyy-MM-dd");
		
		List<Tb_jearecord> tb_pacrecords = null ;
		try {
			date = bartDateFormat.parse(time);
			
			String datenow_1=bartDateFormat.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
			String datenow_2=bartDateFormat.format(new Date(date.getTime()));
			
			date = bartDateFormat.parse(datenow_1);
			Timestamp date1 = new Timestamp(date.getTime());
			date = bartDateFormat.parse(datenow_2);
			Timestamp date2 = new Timestamp(date.getTime());
			tb_pacrecords = jeanRecordRepository.InAountDay(date2, date1);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return tb_pacrecords; 
	}

	@Override
	public List<Tb_jearecord> OutQueryTime(String time) throws ParseException {
		java.util.Date date;
		SimpleDateFormat bartDateFormat =  new SimpleDateFormat("yyyy-MM-dd");
		
		List<Tb_jearecord> tb_pacrecords = null ;
		try {
			date = bartDateFormat.parse(time);
			
			String datenow_1=bartDateFormat.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
			String datenow_2=bartDateFormat.format(new Date(date.getTime()));
			
			date = bartDateFormat.parse(datenow_1);
			Timestamp date1 = new Timestamp(date.getTime());
			date = bartDateFormat.parse(datenow_2);
			Timestamp date2 = new Timestamp(date.getTime());
			tb_pacrecords = jeanRecordRepository.OutAountDay(date2, date1);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return tb_pacrecords; 
	}
	

}
