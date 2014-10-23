/*
 * @(#)DutchAuctionUtil.java        1.0 2013-1-22
 *
 * Copyright (c) 2007-2013 Shanghai Handpay IT, Co., Ltd.
 * 16/F, 889 YanAn Road. W., Shanghai, China
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of 
 * Shanghai Handpay IT Co., Ltd. ("Confidential Information").  
 * You shall not disclose such Confidential Information and shall use 
 * it only in accordance with the terms of the license agreement you 
 * entered into with Handpay.
 */

package com.handpay.wap.actioin.activity.dutchAuction;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.handpay.core.common.util.DateUtils;
import com.handpay.core.merchant.activity.bean.MerchActivityMdseRuleBaseBean;
import com.handpay.core.merchant.activity.bean.SSJActivityMdseRuleBean;
import com.handpay.core.merchant.activity.bean.SSJMdseDownRuleBean;
import com.handpay.core.merchant.activity.mdse.bean.ActivityMdseBean;
import com.handpay.core.merchant.activity.mdse.bean.ActivityMdseMinSellBean;

/**
 * ʱʱ������ת������
 *
 * @version 	1.0 2013-1-22
 * @author		sjzhou
 * @history	
 *		
 */
public class DutchAuctionUtil {
	private static Logger logger = Logger
			.getLogger(DutchAuctionUtil.class);
	
	
	public  static  void covertMdseRuleToJsonStr(ActivityMdseBean mdseBean) {
		MerchActivityMdseRuleBaseBean mdseRule = mdseBean.getMdseRuleBean();
		JsonArray array = new JsonArray();
		/*if (mdseRule != null) {
			SSJActivityMdseRuleBean ssjRule = (SSJActivityMdseRuleBean) mdseRule;
			List<SSJMdseDownRuleBean> downRuleList = ssjRule.getDownRuleList();
			//JsonArray array = new JsonArray();
				try {
					if (downRuleList != null && downRuleList.size() > 0) {
						SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
						ActivityMdseMinSellBean  sellBean = mdseBean.getActivitySell();
						BigDecimal  mdseSellPrice = null;
						if(sellBean!=null){
							mdseSellPrice = sellBean.getPrice();
						}
						_calcMdseDownTime(sellBean);//������Ʒ����ʱҵ��
						
						for (int i = 0; i < downRuleList.size(); i++) {
							SSJMdseDownRuleBean downRule = downRuleList.get(i);
							//�������Ʒ���۹����ʱ���жϹ������ǲ����н��ۺ����Ʒԭ��һ�������������У�Ĭ��������ǰ���򣬲�������Ĭ��Ϊԭ����Ϣ
							if(downRule.getPrice().compareTo(mdseSellPrice)==0){
								continue;
							}
							String startTime = downRule.getStartTime();
							String endTime = downRule.getEndTime();
							
							String currentTime = DateUtils.getCurrentDate("yyyyMMddHHmmss");
							Integer downTime = downRule.getDownTimes();
							if (downTime!=null) {
									long downTimeInMillis = 0;
									Calendar calender = Calendar.getInstance();
									Calendar calender2 = Calendar.getInstance();
									calender.setTime(format.parse(endTime));
									long endTimeInMillis = calender.getTimeInMillis();
									calender2.setTime(format.parse(currentTime));
									long currentTimeInMillis = calender2.getTimeInMillis();
									
									*//**�ж������ǰ�����Ѿ��ڵ���ʱ����ôҪ�ý���ʱ�� ��ȥ��ǰʱ�䣬��û�û�е���ʱ�ĺ�����*//*
									if(currentTime.compareTo(startTime)>=0 && currentTime.compareTo(endTime)<=0){
										downTimeInMillis = endTimeInMillis-currentTimeInMillis;
									}else{
										downTimeInMillis = downRule.getDownTimes()*1000;
									}
									if(currentTime.compareTo(startTime)<=0 && currentTime.compareTo(endTime)<=0){//ֻ��������Ч�ģ���ǰ���Ժ�Ĺ���
											JsonObject json = new JsonObject();
											json.addProperty("index", i+1);
											json.addProperty("endTimeStemp",downTimeInMillis);//����
											json.addProperty("currenTime",currentTime);//����
											json.addProperty("start",startTime);//����
											json.addProperty("end",endTime);//����
											json.addProperty("cutPrice",downRule.getDisCountPrice().toString());
											json.addProperty("endPrice", downRule.getPrice().toString());
											json.addProperty("prevPrice", downRule.getPrevPrice().toString());
											array.add(json);
									}
							}
						}
						logger.debug(mdseBean.getCode()+": ��Ʒ���۹���" + array.toString());
						if(array.size()<=0){//��Ʒ�Ѿ���ͼ�
							mdseBean.getActivitySell().setMdseSellPriceStatus(ActivityMdseMinSellBean.MINSELLPRICE);
						}
						mdseBean.setMdseRuleJson(array.toString());
					}
				} catch (ParseException e) {
					logger.error("�����Ʒ��"+mdseBean.getCode()+" ������Ϣ�쳣",e);
				}
		}*/
	}
	
	
	/**�ж������ǰ��Ʒ�Ѿ��ڵ���ʱ����ôҪ�ý���ʱ�� ��ȥ��ǰʱ�䣬��û�û�е���ʱ�ĺ�����*/
	private static void _calcMdseDownTime(ActivityMdseMinSellBean  sellBean ) throws ParseException{
		if(sellBean!=null){
			String currentTime = DateUtils.getCurrentDate("yyyyMMddHHmmss");
			String mdseStart = sellBean.getStartTime();
			String mdseEnd = sellBean.getEndTime();
			if(currentTime.compareTo(mdseStart)>=0 && currentTime.compareTo(mdseEnd)<=0){
				SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
				Calendar calender = Calendar.getInstance();
				Calendar calender2 = Calendar.getInstance();
				calender.setTime(format.parse(mdseEnd));
				long endTimeInMillis = calender.getTimeInMillis();
				calender2.setTime(format.parse(currentTime));
				long currentTimeInMillis = calender2.getTimeInMillis();
				long downStartTemp = endTimeInMillis-currentTimeInMillis;
				sellBean.setStartTimeMillis(downStartTemp);
			}
		}
	}
}
