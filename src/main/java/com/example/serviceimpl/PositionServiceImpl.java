package com.example.serviceimpl;


import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.PositionRepository;
import com.example.dao.ShelfRepository;
import com.example.module.Tb_position;
import com.example.module.Tb_shelf;
import com.example.service.PositionService;

@Service
public class PositionServiceImpl implements PositionService{
	@Autowired
	private PositionRepository positionRepository;
	@Autowired
	private ShelfRepository shelfRepository;
	@Override
	public void add(Tb_position tb_position) {
		positionRepository.save(tb_position);
	}

	@Override
	public void deleteById(int Id) {
		positionRepository.delete(Id);
	}

	@Override
	public void updateAll(String positionInfo,int volume,int occupation,boolean stationOne,boolean stationTwo) {
		positionRepository.updateAll(positionInfo, volume, occupation, stationOne, stationTwo);
	}
	
	@Override
	public void updateIn(String positionInfo) {
		positionRepository.updateIn(positionInfo);
	}
	
	@Override
	public void updateOut(String positionInfo) {
		positionRepository.updateOut(positionInfo);
	}

	@Override
	public String smartStore() {
		List<Tb_position> listposition = positionRepository.smartStore();
		if(listposition!=null){
			String posInfo = listposition.get(0).getPositionInfo();
			return posInfo;
		}
		return "0000";//没有满足查询条件的位子
	}

	@Override
	public int[] backUsedInfo(String shelfNum) {
		int used = 0;
		int volume = 0;
		List<Tb_position> listPosition = positionRepository.backAllPos(shelfNum);
		for(Tb_position tb_position:listPosition){
			int myoccupation = tb_position.getOccupation();
			int myvolume = tb_position.getVolume();
			used = used + myoccupation;
			volume = volume + myvolume;
		}
		int[] used_info = new int[]{used,volume};
		return used_info;
	}

	@Override
	public List<Tb_position> backAllPos(String posNum) {
		return positionRepository.backAllPos(posNum);
	}

	@Override
	public Tb_position findByPosInfo(String posInfo) {
		return positionRepository.findBypositionInfo(posInfo);
	}

	@Override
	public void updateChangeTime(String position) {
		Date date=new Date();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String time = format.format(date);
		
		Tb_position tb_position = positionRepository.findBypositionInfo(position);
		String myChangeTime = tb_position.getChangeTime();
		if(!myChangeTime.equals(time)){
			positionRepository.updateChangeTime(position, time);
		}
	}


	
	//智能推荐查找位子失败时，放到最小货架的最前面
	public String defaultPosition(){
		//得到所有的货架号
		List<Tb_shelf> listShelf = shelfRepository.findAll();
		List<String> allShelfNum = new ArrayList<String>();
		for(Tb_shelf tb_shelf:listShelf){
			String shelfNum = tb_shelf.getShelfNumber();
			allShelfNum.add(shelfNum);
		}
		//将货架号变为int类型
		int[] intShelfNums = new int[allShelfNum.size()];
		int tem;
		for(int i=0;i<allShelfNum.size();i++){
			intShelfNums[i] = Integer.parseInt(allShelfNum.get(i));
		}
		//给货架号从低到高排序
		for(int i=0;i<allShelfNum.size();i++){
			for(int j=0;j<allShelfNum.size();j++){
				if(j==allShelfNum.size()-1){
					break;
				}
				if(intShelfNums[j]>intShelfNums[j+1]){
					tem = intShelfNums[j+1];
					intShelfNums[j+1] = intShelfNums[j];
					intShelfNums[j] = tem;
				}
			}
		}
		
		//将货架号由int类型又变回string
		allShelfNum.clear();
		for(int i=0;i<intShelfNums.length;i++){
			String strShelfNum = String.format("%02d", intShelfNums[i]);
			allShelfNum.add(strShelfNum);
		}
		
		//判断若有空格子并返回数据
		for(String ShelfNum:allShelfNum){
		List<Tb_position> listPosition = positionRepository.backAllPos(ShelfNum);
		for(Tb_position tb_position:listPosition){
			if(tb_position.getOccupation()==0){
				return tb_position.getPositionInfo();
				}
			}
		}
		
		//每一个货架找到剩余量最多的
		int Difference1;
		int Difference2;
		int DifferenceMax = 0;
		int DifferenceMaxNext =0;
		String DifferenceMaxPosition = "null";
		Tb_position temTb;
		for(String ShelfNum:allShelfNum){
			List<Tb_position> listPosition = positionRepository.backAllPos(ShelfNum);
			for(int j = 0; j < listPosition.size()-1;j++){
				for(int i = 0; i < listPosition.size()-1;i++){
					Difference1=listPosition.get(i).getVolume() - listPosition.get(i).getOccupation();
					Difference2=listPosition.get(i+1).getVolume() - listPosition.get(i+1).getOccupation();
					if(Difference1<Difference2){
						temTb = listPosition.get(i);
						listPosition.set(i,listPosition.get(i+1));
						listPosition.set(i+1,temTb);
						}
					}
			}
			//把每一个货架上剩余量最多的格子比较，并返回
			DifferenceMax = listPosition.get(0).getVolume() - listPosition.get(0).getOccupation();
			if(DifferenceMax > DifferenceMaxNext){
			DifferenceMaxNext = DifferenceMax;
			DifferenceMaxPosition = listPosition.get(0).getPositionInfo();
				}
			for(int i = 0; i < listPosition.size();i++){
			System.out.println(listPosition.get(i).getPositionInfo());}
			System.out.println(DifferenceMaxNext);
			}
		
		
		
		return DifferenceMaxPosition;
	}
	
}
