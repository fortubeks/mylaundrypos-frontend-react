import { RequestService } from "../../../services";

const fetchOverview = async (setLoading, setItems, setPerm, params) => {
  try {
    setLoading(true);
    const response = await RequestService.getParam("/dashboard/overview", {
      time_range: params,
    });
    setItems(response?.data?.data);
    setPerm(response?.data?.data);
    console.log("Overview:", response);
  } catch (error) {
    console.log(error); 
    return error;
  } finally {
    setLoading(false);
  }
};

const fetchShipments = async (setShipLoading, setShipments) => {
  try {
    setShipLoading(true);
    const shipments = await RequestService.get("/shipments");
    setShipments(shipments?.data?.data);
    console.log("Shipments:", shipments);
  } catch (error) {
    console.log(error);
  } finally {
    setShipLoading(false);
  }
};

const fetchTrackingHistory = async (setTrackLoading, setTrackingHistory) => {
  try {
    setTrackLoading(true);
    const trackingHistory = await RequestService.get(
      "/dashboard/tracking-history"
    );
    setTrackingHistory(trackingHistory?.data?.data);
    console.log("Tracking History:", trackingHistory);
  } catch (error) {
    console.log(error);
  } finally {
    setTrackLoading(false);
  }
};

const fetchStock = async (setStockLoading, setStock) => {
  try {
    setStockLoading(true);
    // const stock = await RequestService.get("/dashboard/warehouse-stock");
    // setStock(stock?.data?.data);
    setStock([]);
    // console.log("Stock:", stock);
  } catch (error) {
    console.log(error);
  } finally {
    setStockLoading(false);
  }
};

const fetchChartData = async (setChartLoading, setChartData) => {
  try {
    setChartLoading(true);
    // const chartData = await RequestService.get("/dashboard/warehouse-chart");
    // setChartData(chartData?.data?.data);
    setChartData([]);
    // console.log("Chart Data:", chartData);
  } catch (error) {
    console.log(error);
  } finally {
    setChartLoading(false);
  }
};

const transformChartData = (chartData) => {
  if (!chartData?.labels || !chartData?.datasets?.length) return [];

  const dataset = chartData.datasets[0]; // take the first dataset
  return chartData.labels.map((label, i) => ({
    month: label,
    value: dataset.data[i],
  }));
};

export {
  fetchOverview,
  fetchShipments,
  fetchTrackingHistory,
  fetchStock,
  fetchChartData,
  transformChartData,
};
