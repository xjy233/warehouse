package com.example.controller;


import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.JeanRecordRepository;
import com.example.dao.JeansRepository;
import com.example.dao.PacRecordRepository;
import com.example.dao.PackageRepository;
import com.example.dao.ProviderRepository;
import com.example.dao.UserRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_jearecord;
import com.example.module.Tb_package;
import com.example.module.Tb_pacrecord;
import com.example.module.Tb_user;
import com.example.service.JeansService;
import com.example.service.PackageService;
import com.example.service.UserService;
import com.example.vo.QueryInfo;
import com.example.vo.UserImformation;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;;

@Controller
public class Select {

	@Autowired
	JeansService jeansService;
	@Autowired
	ProviderRepository providerRepository;
	@Autowired
	JeansRepository jeansRepository;
	@Autowired
	PackageRepository packageRepository;
	@Autowired
	PacRecordRepository pacRecordRepository;
	@Autowired
	UserService userService;
	@Autowired
	UserRepository userRepository;
	@Autowired
	PackageService packageService;
	@Autowired
	JeanRecordRepository jeanRecordRepository;
	
	SimpleDateFormat bartDateFormat =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	//返回未出库查询结果   
	@RequestMapping(value = "/query/IntQueryInfo", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
    public JSONObject backIntQueryInfo(@RequestBody QueryInfo query)
	{
		//返回对象
		JSONObject JSONO = new JSONObject();
		JSONArray array = new JSONArray();
		
		
		
		
		//查找未出库货物,前端界面未勾选为false
		//得到包裹实例	
		Tb_package packagestation= packageRepository.findBypackageID(query.getPackageId());
		
		//判断包裹ID是否为空及未出库
		if(!query.getPackageId().equals("")){
			if(packagestation ==null || packagestation.isIfOut()==1){
				JSONO.put("wares", array);
				return JSONO;
			}
			
			List<Tb_jeans> listjeans = jeansRepository.findByPackageId(query.getPackageId());//返回ID、颜色、供应商、款式、尺寸
			Tb_package tb_package = packageRepository.findBypackageID(query.getPackageId());
			
			//将游离态的包裹也计入未出库范畴内
			if(tb_package.isIfOut()!=1){
				
			String packagePisition = tb_package.getPositionInfo();//返回位置信息
			
			Tb_pacrecord tb_pacrecord = pacRecordRepository.findByPacID(query.getPackageId());
			
			Timestamp int_time = tb_pacrecord.getIntTime();	//返回操作时间
			String int_time1=bartDateFormat.format(int_time.getTime());
			
			for(Tb_jeans tb_jeans:listjeans){
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
					json.put("nowNum", tb_jeans.getNowNum());
					json.put("jeansID", tb_jeans.getJeansID());
					json.put("positionInfo",packagePisition);
					json.put("int_time", int_time1);			
					array.add(json);
				}
			}
			}
			JSONO.put("wares", array);
			return JSONO;
			
		}else {
			//包裹ID为空跳转下来,进行复合查询
			//将每一查询条件包装成一个LIST，然后再放进LIST里
			List<Object> listjeans = new ArrayList<Object>();
			List<Tb_jeans> listjeans2 = new ArrayList<>();
			
			for(int i = 0;i<query.getConditions().size();i++){
				Tb_jeans tb_jeans=new Tb_jeans();
				tb_jeans.setProvider(query.getConditions().get(i).getProvider());
				tb_jeans.setColour(query.getConditions().get(i).getColour());
				tb_jeans.setSize(query.getConditions().get(i).getSize());
				tb_jeans.setDepartment(query.getConditions().get(i).getDepartment());
				tb_jeans.setBrand (query.getConditions().get(i).getBrand());
				tb_jeans.setFitting(query.getConditions().get(i).getFitting());
				tb_jeans.setModuleNum(query.getConditions().get(i).getModuleNum());
				
				listjeans2 = jeansService.findSearch(tb_jeans);
				
				listjeans.add(listjeans2);
			}
			
			//将packageId存入一个集合中
			List<String> list1 =new ArrayList<String>(); //LIST1为交集
			List<String> list2 =new ArrayList<String>();
			
			//得到交集，并把交集结果存入list1中
			getSet:
			for(int i=0;i<query.getConditions().size();i++){
				
			List<Tb_jeans> mylist = (List<Tb_jeans>) listjeans.get(i); //注意当MYLIST没有值时不会进行下面的循环
			
			
			if(mylist.isEmpty()){
				list1.clear();
				break getSet;	
			}else{
				list2.clear();
				for(Tb_jeans tb_jeans:mylist)
				{list2.add(tb_jeans.getPackageId());}
			
				if(list1.isEmpty())
				{list1 = list2;}
				
				list2.retainAll(list1);
				list1=list2;
				}
			}
			
			//去除重复元素
			packageService.removeDuplicate(list1);
			
			
			
			//取出查询数组
			for(String packageID:list1){
				Tb_package tb_package= packageRepository.findBypackageID(packageID);
				List<Tb_jeans> listjeans1 = jeansRepository.findByPackageId(packageID);
				String packagePisition = tb_package.getPositionInfo();
				
				Tb_pacrecord tb_pacrecord = pacRecordRepository.findByPacID(packageID);//返回入库时间
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
						json.put("jeansID", tb_jeans.getJeansID());
						json.put("positionInfo",packagePisition);
						json.put("nowNum", tb_jeans.getNowNum());
						json.put("int_time", int_time1);			
						array.add(json);
					}
				}
			}
				
		JSONO.put("wares", array);
		System.out.println(JSONO);
		return JSONO;			
		}
	}

	//返回出库货物查询结果   
	@RequestMapping(value = "/query/OutQueryInfo", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public JSONObject backOutQueryInfo(@RequestBody QueryInfo query)
	{
		
		//返回对象
		JSONObject JSONO = new JSONObject();
		JSONArray array = new JSONArray();
		
		//******对应查询已出库货物  数据库表里包裹存在为true
		//得到包裹实例	
		Tb_package packagestation= packageRepository.findBypackageID(query.getPackageId());
		
		//判断包裹ID是否为空及未出库
		if(!query.getPackageId().equals("") ){
			
			if(packagestation ==null ){
				JSONO.put("wares", array);
				return JSONO;
			}
			
			List<Tb_jeans> listjeans = jeansRepository.findByPackageId(query.getPackageId());//返回ID、颜色、供应商、款式、尺寸
			
			Tb_package tb_package = packageRepository.findBypackageID(query.getPackageId());
			String packagePisition = tb_package.getPositionInfo();//返回位置信息
			
			for(Tb_jeans tb_jeans:listjeans){
				if(tb_jeans.getAmount()>tb_jeans.getNowNum()){
					
					Tb_jearecord tb_jearecord = jeanRecordRepository.findByJeaID(tb_jeans.getJeansID());
					Timestamp out_time = tb_jearecord.getOutTime();	//返回操作时间
					String out_time1=bartDateFormat.format(out_time.getTime());
					
					if(tb_jeans.getAmount()>tb_jeans.getNowNum()){
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
					json.put("outNum", tb_jeans.getAmount() - tb_jeans.getNowNum());
					json.put("out_time", out_time1);			
					array.add(json);
					}
			}
		}
			System.out.println(array);
			JSONO.put("wares", array);
			
			return JSONO;
			
		}else {
			//包裹ID为空跳转下来,进行复合查询
			//将每一查询条件包装成一个LIST，然后再放进LIST里
			List<Object> listjeans = new ArrayList<Object>();
			for(int i = 0;i<query.getConditions().size();i++){
			Tb_jeans tb_jeans=new Tb_jeans();
			tb_jeans.setProvider(query.getConditions().get(i).getProvider());
			tb_jeans.setColour(query.getConditions().get(i).getColour());
			tb_jeans.setSize(query.getConditions().get(i).getSize());
			tb_jeans.setDepartment(query.getConditions().get(i).getDepartment());
			tb_jeans.setBrand (query.getConditions().get(i).getBrand());
			tb_jeans.setFitting(query.getConditions().get(i).getFitting());
			tb_jeans.setModuleNum(query.getConditions().get(i).getModuleNum());
			List<Tb_jeans> listjeans2 = jeansService.findSearch(tb_jeans);
			listjeans.add(listjeans2);
			}
			
			//将packageId存入一个集合中
			List<String> list1 =new ArrayList(); //LIST1为交集
			Set<String> set1= new HashSet<String>();
			List<String> list2 =new ArrayList();
			//得到交集，并把交集结果存入list1中
			getSet:
			for(int i=0;i<query.getConditions().size();i++){	
			List<Tb_jeans> mylist = (List<Tb_jeans>) listjeans.get(i); //注意当MYLIST没有值时不会进行下面的循环
			
			if(mylist.isEmpty()){
				list1.clear();
				break getSet;	
			}else{
				list2.clear();
				for(Tb_jeans tb_jeans:mylist)
				{list2.add(tb_jeans.getPackageId());}
			
				if(list1.isEmpty())
				{list1 = list2;}
				
				list2.retainAll(list1);
				list1=list2;
			}
				
			}
				
			set1.addAll(list1);
			System.out.println(set1);
			
			//取出查询数组
			for(String packageID:set1){
				Tb_package tb_package= packageRepository.findBypackageID(packageID);
				List<Tb_jeans> tb_jeans = jeansRepository.findByPackageId(packageID);
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
			JSONO.put("wares", array);
			System.out.println(JSONO);
			return JSONO;			
		}
	}
	
	
	@RequestMapping("/getUserInfomation")
	@ResponseBody
	public JSONObject getUserInfomation() {
		//返回对象
		JSONObject JSONO = new JSONObject();
		
		 UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	        Tb_user user=userRepository.getByUsername(userDetails.getUsername());
	        UserImformation userImformation=new UserImformation();
	        
	        //是否需要修改密码
	        String password = user.getPassword();
	        String initPassword = user.getInitPassword();
	        String email = user.geteMail();
	        int userType = user.getUserType();
	        
	        if(password.equals(initPassword)){
	        	userImformation.setIfUpdatePw(true);
	        }
	        else{
	        	userImformation.setIfUpdatePw(false);
	        }
	        //超管是否需要填写初始邮箱
	        if(userType==0&&email==null){
	        	userImformation.setIfUpdateEm(true);
	        }
	        else{
	        	userImformation.setIfUpdateEm(false);
	        }
	        userImformation.setName(user.getName());
	        userImformation.setExtras(user.getExtras());
	        userImformation.setRole(user.getUserType());
	        userImformation.setUsername(user.getUsername());
		JSONO.put("UserInfomation",userImformation);
		return JSONO;
	}
	
}

