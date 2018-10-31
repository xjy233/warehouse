package com.example.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.JeansRepository;
import com.example.dao.PackageRepository;
import com.example.dao.ShelfRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_package;
import com.example.module.Tb_position;
import com.example.module.Tb_shelf;
import com.example.service.PackageService;
import com.example.service.PositionService;
import com.example.service.ShelfService;

import net.sf.json.JSONObject;

@Controller
public class ShelfManage {
	@Autowired
	ShelfRepository shelfRepository;
	@Autowired
	PackageRepository packageRepository;
	@Autowired
	JeansRepository jeansRepository;
	@Autowired
	ShelfService shelfService;
	@Autowired
	PositionService positionService;
	@Autowired
	PackageService packageService;
	
	private String str1 = "add success";
	private String str2 = "delete success";
	private String str3 = "Exist";
	boolean station = true;
	
	
	//进入货架管理页面，返回所有货架的使用信息，调用/backShelfUsed
	//进入货架管理页面，点击添加货架
	@RequestMapping("/Manage/addShelf")
	@ResponseBody
	public JSONObject addShelf(@RequestParam("shelfNum") int shelfNum,@RequestParam("shelfRow") int shelfRow,
			@RequestParam("shelfCol") int shelfCol,@RequestParam("pacAmount") int pacAmount){
		JSONObject jsonObject = new JSONObject();
		String strShelfNum = String.format("%02d", shelfNum);//新建货架的货架号
		List<Tb_shelf> listShelf = shelfRepository.findAll();
		//判断新加货架号是否存在
		for(Tb_shelf tb_shelf:listShelf){ 
			String myshelfNum = tb_shelf.getShelfNumber();
			if(myshelfNum.equals(strShelfNum)){
				jsonObject.put("backInfo", str3);
				return jsonObject;
			}
		}
		
		Tb_shelf tb_shelf = new Tb_shelf(shelfRow,shelfCol,pacAmount,strShelfNum);
		shelfService.add(tb_shelf);
		//初始化新建货架的位子信息
		int row = tb_shelf.getShelfRow();
		int col = tb_shelf.getShelfCol();
		int mypacAmount = tb_shelf.getPacAmount();
		for(int j=1;j<=row;j++){
			for(int k=1;k<=col;k++){
				String pos;
				if(k<10){
					 pos = ""+strShelfNum+j+"0"+k;
				}
				else{
					 pos = ""+strShelfNum+j+k;
				}
				Tb_position tb_position = new Tb_position(pos, mypacAmount, 0,"0", station);
				positionService.add(tb_position);
			}
		}
		jsonObject.put("backInfo", str1);
		return jsonObject;
	}
	
	//进入货架管理页面，点击删除货架,一般不轻易点击删除
	@RequestMapping("/Manage/deleteShelf")
	@ResponseBody
	public JSONObject deleteShelf(@RequestParam("shelfNum") String shelfNum){
		List<Tb_position> listPos = positionService.backAllPos(shelfNum);
		List<String> allPac = new ArrayList<String>();
		for(Tb_position tb_position:listPos){
			List<Tb_package> listPac = packageService.findByPosInfo(tb_position.getPositionInfo());
			for(Tb_package tb_package:listPac){
				if(tb_package.isIfOut()!=1){
					allPac.add(tb_package.getPackageID());
				}
			}
		}
		//1.确定删除时，更改新位子的使用信息及状态
		List<String> listShelfNum = shelfService.sortShelfNum();
		int p = 0;//跟踪allPac的指针
		for(String myshelfNum:listShelfNum){
			if(!myshelfNum.equals(shelfNum)){
				List<Tb_position> mylistPos = positionService.backAllPos(myshelfNum);
				for(Tb_position tb_position:mylistPos){
					int myrest = tb_position.getVolume()-tb_position.getOccupation();
					for(int i=0;i<myrest;i++){
						if(p<allPac.size()){
							//更改包裹的位子信息
							packageRepository.setPosition(allPac.get(p), tb_position.getPositionInfo());
							//更改位子使用信息并且更改位子状态
							positionService.updateIn(tb_position.getPositionInfo());
							positionService.updateChangeTime(tb_position.getPositionInfo());
							p++;
						}
					}
				}
			}
		}
		//2.删除位子信息
		shelfRepository.deleteByShelfNum(shelfNum);
		List<Tb_position> listAllPos = positionService.backAllPos(shelfNum);
		for(Tb_position tb_position:listAllPos){
			int posId = tb_position.getPositionID();
			positionService.deleteById(posId);
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("backInfo", str2);
		return jsonObject;
	}
	
	//智能分发
	@RequestMapping("/Manage/smartSend")
	@ResponseBody
	public JSONObject smartSend(@RequestParam("shelfNum") String shelfNum){
		JSONObject jsonObject = new JSONObject();
		//1.获取该货架上的所有包裹
		List<Tb_position> listPos = positionService.backAllPos(shelfNum);
		List<String> allPac = new ArrayList<String>();
		for(Tb_position tb_position:listPos){
			List<Tb_package> listPac = packageService.findByPosInfo(tb_position.getPositionInfo());
			for(Tb_package tb_package:listPac){
				if(tb_package.isIfOut()!=1){
					allPac.add(tb_package.getPackageID());
				}
			}
		}
		//2.进行智能分发
		List<Object> listAllPac = new ArrayList<Object>();
		List<String> listShelfNum = shelfService.sortShelfNum();
		int p = 0;//跟踪allPac的指针
		for(String myshelfNum:listShelfNum){
			if(!myshelfNum.equals(shelfNum)){
				List<Tb_position> mylistPos = positionService.backAllPos(myshelfNum);
				for(Tb_position tb_position:mylistPos){
					int myrest = tb_position.getVolume()-tb_position.getOccupation();
					for(int i=0;i<myrest;i++){
						if(p<allPac.size()){
							List<Object> listSinPac = new ArrayList<Object>();
							Tb_package tb_package = packageRepository.findBypackageID(allPac.get(p));
							listSinPac.add(allPac.get(p));//包裹ID
							listSinPac.add(tb_package.getPositionInfo());//旧位子
							listSinPac.add(tb_position.getPositionInfo());//新位子
							//包裹里的详细裤子信息
							List<Tb_jeans> listJeans = jeansRepository.findByPackageId(allPac.get(p));
							for(Tb_jeans tb_jeans:listJeans){
								List<Object> sinJeans = new ArrayList<Object>();
								sinJeans.add(tb_jeans.getModuleNum());
								sinJeans.add(tb_jeans.getDepartment());
								sinJeans.add(tb_jeans.getBrand());
								sinJeans.add(tb_jeans.getFitting());
								sinJeans.add(tb_jeans.getProvider());
								sinJeans.add(tb_jeans.getColour());
								sinJeans.add(tb_jeans.getSize());
								sinJeans.add(tb_jeans.getNowNum());
								listSinPac.add(sinJeans);
							}
							listAllPac.add(listSinPac);
							p++;
						}
						else{
							jsonObject.put("backInfo", listAllPac);
							return jsonObject;
						}
					}
				}
			}
		}
		return null;
	}
	
	
	//进入货架扩容页面，点击货架扩容，前端提示确定扩容，则增加该货架的列数
	@RequestMapping("/Manage/addShelfCol")
	@ResponseBody
	public JSONObject addShelfCol(@RequestParam("shelfNum") String shelfNum,@RequestParam("shelfCol") int shelfCol){
		int iD = Integer.parseInt(shelfNum);
		Tb_shelf tb_shelf = shelfRepository.findOne(iD);
		int oldCol = tb_shelf.getShelfCol();
		int row = tb_shelf.getShelfRow();
		int mypacAmount = tb_shelf.getPacAmount();
		int col = oldCol + shelfCol;
		shelfService.updateCol(iD,col);
		//初始化新加列的位子信息
		for(int j=1;j<=row;j++){
			for(int k=oldCol+1;k<=col;k++){
				String pos;
				if(k<10){
					 pos = ""+shelfNum+j+"0"+k;
				}
				else{
					 pos = ""+shelfNum+j+k;
				}
				Tb_position tb_position = new Tb_position(pos, mypacAmount, 0,"0",station);
				positionService.add(tb_position);
			}
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("backInfo", str1);
		return jsonObject;
	}
}
