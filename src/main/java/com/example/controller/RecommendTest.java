package com.example.controller;


import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.JeansRepository;
import com.example.dao.PackageRepository;
import com.example.dao.PositionRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_package;
import com.example.module.Tb_position;
import com.example.service.JeansService;
import com.example.service.PositionService;
import com.example.vo.smartOutRecommend;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


@Controller
public class RecommendTest {

	@Autowired
	JeansService jeansService;
	@Autowired
	PackageRepository packageRepository;
	@Autowired
	PositionRepository positionRepository;
	@Autowired
	PositionService positionService;
	@Autowired
	JeansRepository jeansRepository;
	
	@RequestMapping("/InHouse/smartStroe")
	@ResponseBody
    public synchronized JSONObject SmartStroe(@RequestParam(value="moduleNum") String moduleNum){
		Tb_package tb_packagejudge = new Tb_package();
		//返回对象
		JSONObject jsonObject =new JSONObject();
		String position_Info = "null";
		
		//根据moduleNum查找
		List<Tb_jeans> listjeans = jeansRepository.findByModuleNum(moduleNum);
		
		if(listjeans.size() != 0){   //找得到moduleNum相同的
			//得到packageId的不重复集合
			Set<String> setId= new HashSet<String>();  
			for(Tb_jeans tb_jean:listjeans){
				tb_packagejudge = packageRepository.findBypackageID(tb_jean.getPackageId());
				if(tb_packagejudge.isIfOut()!=1){
				setId.add(tb_jean.getPackageId());}
				}
			
			//将ID与数量对应起来
			int amount = 0;
			Map mapId = new HashMap();
			for(String id:setId){
				for(Tb_jeans tb_jean:listjeans){
					if(id.equals(tb_jean.getPackageId()))
					{amount = amount + tb_jean.getAmount();}
				}
			mapId.put(id, amount);
			amount = 0;
			}
			
			//得到数量最多的packaID
			String IDcord=null;
			int max=0;
			int min=0;
			for(String id:setId){
				min = (int)mapId.get(id);
				if(max<=min)
				{max = min;IDcord = id;}
			}
			//得到包裹位置信息的使用量
			if(IDcord!=null){
				Tb_package tb_package = packageRepository.findBypackageID(IDcord);
				position_Info =tb_package.getPositionInfo();
				Tb_position tb_position = positionRepository.findBypositionInfo(position_Info);
				int occupation = tb_position.getOccupation();
				
				if(occupation<tb_position.getVolume() && tb_position.isStation()){
					jsonObject.put("positionInfo", position_Info);
					System.out.println(jsonObject);
					return jsonObject;
				}
			}else{
				//放在相邻格子
				//放在最下层的一个格子里
				position_Info = positionService.defaultPosition();
			}
		}else{//找不到moduleNum相同的
				//放在相邻格子
				//放在最下层的一个格子里
				position_Info = positionService.defaultPosition();
		}
	jsonObject.put("positionInfo", position_Info);
	System.out.println(jsonObject);
	return jsonObject;
	}
	
	@RequestMapping("/OutHouse/SmartOut")
	@ResponseBody
    public synchronized JSONObject SmartOut(@RequestBody smartOutRecommend smartOutRecommend){
		//返回对象
		JSONObject jsonObject =new JSONObject();
		JSONArray array = new JSONArray();
		
		int smartOutRecommendNum = smartOutRecommend.getModuleNum().length;
		
		//查找满足的包裹
		List<Tb_jeans> tb_jeans;
		int amount = 0;
		Tb_package tb_packageIfout; 
		for(int i=0 ;i < smartOutRecommendNum;i++){
			tb_jeans = jeansRepository.findByModuleNum(smartOutRecommend.getModuleNum()[i]);
			for(Tb_jeans tb_jean:tb_jeans){
				amount = 0;
				tb_packageIfout = packageRepository.findBypackageID(tb_jean.getPackageId());
				if(tb_jean.getNowNum() != 0 && amount < smartOutRecommend.getQuantity()[i] && tb_packageIfout.isIfOut() ==0){
					JSONObject json=new JSONObject();
					
					amount = amount + tb_jean.getNowNum();//计数，不超过出库的数量
					
					//返回位置信息
					Tb_package tb_package = packageRepository.findBypackageID(tb_jean.getPackageId());
					String packagePisition =tb_package.getPositionInfo();
					//返回出库的裤子数量
					if(amount>smartOutRecommend.getQuantity()[i]){
						json.put("OutNum", smartOutRecommend.getQuantity()[i]-amount+tb_jean.getNowNum());
					}else{
						json.put("OutNum", tb_jean.getNowNum());
					}
					json.put("packageID", tb_jean.getPackageId());
					json.put("jeansID", tb_jean.getJeansID());
					json.put("colour", tb_jean.getColour());
					json.put("provider", tb_jean.getProvider());
					json.put("size", tb_jean.getSize());
					json.put("positionInfo",packagePisition);
					json.put("brand", tb_jean.getBrand());
					json.put("department", tb_jean.getDepartment());
					json.put("fitting", tb_jean.getFitting());
					json.put("moduleNum", tb_jean.getModuleNum());
					array.add(json);
				}
			}
			jsonObject.put("EverModuleNum",array);
		}
		
		
		System.out.println(jsonObject);
		return jsonObject;
	}
	
	
}
