package com.example.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.PackageRepository;
import com.example.dao.PositionRepository;
import com.example.module.Tb_package;
import com.example.module.Tb_position;
import com.example.service.PositionService;
import com.example.service.ShelfService;

import net.sf.json.JSONObject;

@Controller
public class AllCheck {
	@Autowired
	private PositionRepository positionRepository;
	@Autowired
	private PackageRepository packageRepository;
	@Autowired
	private PositionService positionService;
	@Autowired
	private ShelfService shelfService;
	
	
	//返回所有货架的使用信息
	@RequestMapping("/backShelfUsed")
	@ResponseBody
    public JSONObject backShelfUsed() {
		List<Object> listAll = new ArrayList<Object>();
		List<String> listShelfNum = shelfService.sortShelfNum();
		for(String shelfNum:listShelfNum){
			int[] usedInfo = positionService.backUsedInfo(shelfNum);
			List<Object> listUsed = new ArrayList<Object>();
			listUsed.add(shelfNum);//货架号
			listUsed.add(usedInfo[0]);//使用量
			listUsed.add(usedInfo[1]);//总容量
			listAll.add(listUsed);
		}
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("listUsed",listAll);
		return jsonobj;
    }
	
	//点击详情，返回货架的具体位子使用信息，直接调用/backPositionUsed
	//点击打印，返回给前端该货架上所有的位子上的包裹信息
	@RequestMapping("/AllCheck/backAllPac")
	@ResponseBody
	public JSONObject backAllPac(@RequestParam("shelfNum") String shelfNum){
		List<Tb_position> listPosition = positionRepository.backAllPos(shelfNum);
		List<Object> allPac = new ArrayList<Object>();
		Date date=new Date();
		DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=format.format(date);
		allPac.add(time);
		for(Tb_position tb_position:listPosition){
			List<Tb_package> listPac = packageRepository.findByPosInfo(tb_position.getPositionInfo());
			for(Tb_package tb_package:listPac){
				//判断包裹是否出库
				if(tb_package.isIfOut()!=1){
					String pacID = tb_package.getPackageID();
					String posInfo = tb_package.getPositionInfo();
					
					List<Object> singPac = new ArrayList<Object>();
					singPac.add(pacID);
					singPac.add(posInfo);
					allPac.add(singPac);
				}
			}
		}
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("allPac", allPac);
		return jsonObject;
	}
	
	//点击具体位子，返回位子上的包裹ID信息
	@RequestMapping("/backPac")
	@ResponseBody
	public JSONObject backPac(@RequestParam("position") String positionInfo){
		List<Tb_package> listPac = packageRepository.findByPosInfo(positionInfo);
		List<Object> listAllPac = new ArrayList<Object>();
		for(Tb_package tb_package:listPac){
			//判断包裹是否出库
			if(tb_package.isIfOut()!=1){
				String pacID = tb_package.getPackageID();
				listAllPac.add(pacID);	
			}
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("listAllPac", listAllPac);
		return jsonObject;	
	}
	
	//进入变动盘点页面，返回前端所有变动位子的位子信息及包裹数量
	@RequestMapping("/AllCheck/backChangePos")
	@ResponseBody
	public JSONObject backChangePos(){
		List<Tb_position> listPos = positionRepository.findAll();
		List<Object> allPos = new ArrayList<Object>();
		Date date = new Date();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String time = format.format(date);
		for(Tb_position tb_position:listPos){
			String myChangeTime = tb_position.getChangeTime();
			//判断有无变动
			if(myChangeTime.equals(time)){
				String posInfo = tb_position.getPositionInfo();
				int occupation = tb_position.getOccupation();
				
				List<Object> singPos = new ArrayList<Object>();
				singPos.add(posInfo);
				singPos.add(occupation);
				allPos.add(singPos);	
			}
		}	
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("allPac", allPos);
		return jsonObject;	
	}
	
	
	//在变动盘点页面，点击一建打印返回所有有变动情况的位子上的包裹信息
	@RequestMapping("/AllCheck/backChangePac")
	@ResponseBody
	public JSONObject backChangePac(){
		List<Tb_position> listpos = positionRepository.findAll();
		List<Object> allPac = new ArrayList<Object>();
		Date date=new Date();
		DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String checkTime=format.format(date);
		allPac.add(checkTime);
		String time = checkTime.substring(0,10);
		for(Tb_position tb_position:listpos){
			String myChangeTime = tb_position.getChangeTime();
			//判断有无变动
			if(myChangeTime.equals(time)){
				List<Tb_package> listPac = packageRepository.findByPosInfo(tb_position.getPositionInfo());
				for(Tb_package tb_package:listPac){
					//判断包裹是否出库
					if(tb_package.isIfOut()!=1){
						String pacID = tb_package.getPackageID();
						String posInfo = tb_package.getPositionInfo();
						
						List<Object> singPac = new ArrayList<Object>();
						singPac.add(pacID);
						singPac.add(posInfo);
						allPac.add(singPac);
					}
				}
			}
		}
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("allPac", allPac);
		return jsonObject;	
	}
	
}
