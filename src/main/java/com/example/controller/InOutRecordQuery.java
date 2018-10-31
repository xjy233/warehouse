package com.example.controller;

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
import com.example.dao.PackageRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_jearecord;
import com.example.module.Tb_package;
import com.example.module.Tb_pacrecord;
import com.example.service.PacRecordService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
public class InOutRecordQuery {

	
	@Autowired
	PackageRepository packageRepository;
	@Autowired
	PacRecordRepository pacRecordRepository;
	@Autowired
	PacRecordService pacRecordService;
	@Autowired
	JeansRepository jeansRepository;
	@Autowired
	InOutRecordQuery aInOutRecordQuery;
	@Autowired
	JeanRecordRepository jeanRecordRepository;
	
	//返回对象
	JSONObject JSONO = new JSONObject();
	JSONArray array = new JSONArray();
	//时间转换格式
	SimpleDateFormat bartDateFormat =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	//查询入库记录
	public JSONArray InRecordQuery(String intTime,String inUsername,String positionInfo) {
		
		List<String> set= new ArrayList<String>();
		
		//先查positionInfo的packageID
		List<Tb_package> packages = new ArrayList<>();

		//先查positionInfo的packageID
		if(!positionInfo.equals("")){
		packages = packageRepository.findByPosInfo(positionInfo);
		if(packages.isEmpty()){return array;}
		}else{
			packages = packageRepository.findAll();
		}
	
		if(!inUsername.equals("")){
			//查同时满足USERID
			List<Tb_jearecord> pacrecordsName = jeanRecordRepository.findByInUsername(inUsername);
			if(pacrecordsName.isEmpty()){return array;}
			if(!intTime.equals("")){
				//查同时满足intTime
				try {
					List<Tb_jearecord> pacrecordsTime = pacRecordService.InQueryTime(intTime);
					if(pacrecordsTime.isEmpty()){return array;}
					//取到id的交集
					set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
				} catch (ParseException e) {e.printStackTrace();}
			}else{				
				List<Tb_jearecord> pacrecordsTime =jeanRecordRepository.findAll();
				
				//取到id的交集
				set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
			}
		}else{
			List<Tb_jearecord> pacrecordsName = jeanRecordRepository.findAll();
			
			if(!intTime.equals("")){
				//查同时满足intTime
				List<Tb_jearecord> pacrecordsTime;
				try {
					pacrecordsTime = pacRecordService.InQueryTime(intTime);
					if(pacrecordsTime.isEmpty()){return array;}
					//取到id的交集
					set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
				} catch (ParseException e) {
					e.printStackTrace();
				}	
			}else{				
				List<Tb_jearecord> pacrecordsTime =jeanRecordRepository.findAll();
				
				//取到id的交集
				set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
			}
		}
	
		//返回packageID、Style、Size,Color,position,time,amount
		for(String setID:set){
			Tb_package tb_package= packageRepository.findBypackageID(setID);
			List<Tb_jeans> listjeans1 = jeansRepository.findByPackageId(setID);
			String packagePisition = tb_package.getPositionInfo();
			
			Tb_pacrecord tb_pacrecord = pacRecordRepository.findByPacID(setID);//返回入库时间
			Timestamp int_time = tb_pacrecord.getIntTime();
			String int_time1=bartDateFormat.format(int_time.getTime());
		//判断包裹状态
			for(Tb_jeans tb_jeans:listjeans1){
				if(tb_jeans.getNowNum() != 0){
					JSONObject json=new JSONObject();
					json.put("brand", tb_jeans.getBrand());
					json.put("department", tb_jeans.getDepartment());
					json.put("fitting", tb_jeans.getFitting());
					json.put("moduleNum", tb_jeans.getModuleNum());
					json.put("packageID", tb_jeans.getPackageId());
					json.put("colour", tb_jeans.getColour());
					json.put("provider", tb_jeans.getProvider());
					json.put("size", tb_jeans.getSize());
					json.put("positionInfo",packagePisition);
					json.put("amount", tb_jeans.getAmount());
					json.put("int_time", int_time1);			
					array.add(json);
				}
			}
		}
		return array;
	}
	
	//查询出库记录
	public JSONArray OutRecordQuery(String outTime,String outUsername,String positionInfo) throws ParseException{
		List<String> set= new ArrayList<String>();
		
		//先查positionInfo的packageID
		List<Tb_package> packages = new ArrayList<>();
		
		if(!positionInfo.equals("")){
		packages = packageRepository.findByPosInfo(positionInfo);
		if(packages.isEmpty()){return array;}		
		}else{
		packages = packageRepository.findAll();
		}
		
		if(!outUsername.equals("")){
			//查同时满足USERID
			List<Tb_jearecord> pacrecordsName = jeanRecordRepository.findByOutUsername(outUsername);
			if(pacrecordsName.isEmpty()){return array;}		
			if(!outTime.equals("")){
				//查同时满足intTime
				List<Tb_jearecord> pacrecordsTime = pacRecordService.OutQueryTime(outTime);
				if(pacrecordsTime.isEmpty()){return array;}	
				//取到id的交集
				set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
			}else{				
				List<Tb_jearecord> pacrecordsTime =jeanRecordRepository.findAll();
				
				//取到id的交集
				set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
			}
		}else{
			List<Tb_jearecord> pacrecordsName = jeanRecordRepository.findAll();
			
			if(!outTime.equals("")){
				//查同时满足intTime
				List<Tb_jearecord> pacrecordsTime = pacRecordService.OutQueryTime(outTime);
				if(pacrecordsTime.isEmpty()){return array;}	
				//取到id的交集
				set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
				
			}else{				
				List<Tb_jearecord> pacrecordsTime =jeanRecordRepository.findAll();
				
				//取到id的交集
				set = pacRecordService.InOutRecordQuerySet(packages, pacrecordsName, pacrecordsTime);
			}
		}
		
		//返回packageID、Style、Size,Color,position,time,amount
		for(String setID:set){
			Tb_package tb_package= packageRepository.findBypackageID(setID);
			List<Tb_jeans> tb_jeans = jeansRepository.findByPackageId(setID);
			String packagePisition = tb_package.getPositionInfo();//位子信息
		//判断包裹状态
			for(int i=0;i<tb_jeans.size();i++){
				if(tb_jeans.get(i).getAmount()>tb_jeans.get(i).getNowNum()){
					
					Tb_jearecord tb_jearecord = jeanRecordRepository.findByJeaID(tb_jeans.get(i).getJeansID());
					Timestamp out_time = tb_jearecord.getOutTime();	//返回操作时间
					String out_time1=bartDateFormat.format(out_time.getTime());
					
					JSONObject json=new JSONObject();
					json.put("brand", tb_jeans.get(i).getBrand());
					json.put("department", tb_jeans.get(i).getDepartment());
					json.put("fitting", tb_jeans.get(i).getFitting());
					json.put("moduleNum", tb_jeans.get(i).getModuleNum());
					json.put("packageID", tb_jeans.get(i).getPackageId());
					json.put("colour", tb_jeans.get(i).getColour());
					json.put("provider", tb_jeans.get(i).getProvider());
					json.put("size", tb_jeans.get(i).getSize());
					json.put("positionInfo",packagePisition);
					json.put("outNum", tb_jeans.get(i).getAmount() - tb_jeans.get(i).getNowNum());
					json.put("out_time", out_time1);
					array.add(json);
				}
			}
		}
		return array;			
	}
	
	@RequestMapping("/InOutRecordQuery/InOrOutRecordQuery")
	@ResponseBody
	public JSONObject InOrOutRecordQuery(@RequestParam(value="positionInfo") String positionInfo,@RequestParam(value="packageId") String packageId,
			@RequestParam(value="Time") String Time,@RequestParam(value="Username") String Username,@RequestParam(value="station") Boolean station) 
					throws ParseException{
		//返回对象
		JSONO = new JSONObject();
		array = new JSONArray();

		if(!packageId.equals("")){
			List<Tb_jeans> jeanslist = jeansRepository.findByPackageId(packageId);
			Tb_package tb_package= packageRepository.findBypackageID(packageId);
			//判断能否找到packageID
			if(tb_package ==null){
				JSONO.put("wares", array);
				return JSONO;
			}
			
			String packagePisition = tb_package.getPositionInfo();			
			Tb_pacrecord tb_pacrecord = pacRecordRepository.findByPacID(packageId);
			
			
			
			//得到时间
			String int_time1 = null;
			
			for(Tb_jeans tb_jean:jeanslist){
				Tb_jearecord tb_jearecord = jeanRecordRepository.findByJeaID(tb_jean.getJeansID());
				if(!station ||tb_jearecord.getOutTime() !=null){
					if(!station ){
						Timestamp int_time = tb_jearecord.getInTime();			
						int_time1=bartDateFormat.format(int_time.getTime());
					}
					else{
						Timestamp int_time = tb_jearecord.getOutTime();			
						int_time1=bartDateFormat.format(int_time.getTime());
					}
					
					//装填数组
						JSONObject json=new JSONObject();
						json.put("packageID", tb_jean.getPackageId());
						json.put("colour", tb_jean.getColour());
						//得到USERID和出入库量
						if(!station){
							json.put("UserId", tb_pacrecord.getInUsername());
							json.put("amount", tb_jean.getAmount());
						}
						else{
							json.put("UserId", tb_pacrecord.getOutUsername());
							json.put("amount", tb_jean.getAmount()-tb_jean.getNowNum());
							}	
						json.put("brand", tb_jean.getBrand());
						json.put("department", tb_jean.getDepartment());
						json.put("fitting", tb_jean.getFitting());
						json.put("moduleNum", tb_jean.getModuleNum());	
						json.put("size", tb_jean.getSize());
						json.put("positionInfo",packagePisition);
						json.put("time", int_time1);
						json.put("provider", tb_jean.getProvider());
						array.add(json);
					}
				
			}
		}else{
			//当station为ture时为出库，即前端勾选了出库按钮	
			if(station){
				array = aInOutRecordQuery.OutRecordQuery(Time, Username, positionInfo);
			}else{
				array = aInOutRecordQuery.InRecordQuery(Time, Username, positionInfo);
			}
		}
		JSONO.put("wares", array);
		System.out.println(JSONO);
		return JSONO;	
	}
	
}
