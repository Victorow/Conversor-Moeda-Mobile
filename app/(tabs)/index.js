// app/(tabs)/index.js

import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const API_KEY = '7ded0e3e'; // Sua chave da API

export default function ConversorScreen() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState('0.00');
  const [rates, setRates] = useState({});
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.hgbrasil.com/finance?format=json-cors&key=${API_KEY}`);
      const data = response.data.results.currencies;
      const fetchedRates = {
        USD: data.USD.buy, EUR: data.EUR.buy, GBP: data.GBP.buy, BRL: 1,
      };
      setRates(fetchedRates);
      setChartData({
        labels: ['BRL', 'USD', 'EUR', 'GBP'],
        datasets: [{ data: [1, data.USD.buy, data.EUR.buy, data.GBP.buy] }],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency] && !isNaN(parseFloat(amount))) {
      const amountInBRL = parseFloat(amount) * rates[fromCurrency];
      const result = amountInBRL / rates[toCurrency];
      setConvertedAmount(result.toFixed(2));
    } else {
      setConvertedAmount('0.00');
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const switchCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // ===== Objeto de configuração do gráfico foi movido para fora para maior clareza =====
  const chartConfig = {
    backgroundGradientFrom: '#2d3748',
    backgroundGradientTo: '#1a202c', // Gradiente mais sutil e escuro
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(99, 179, 237, ${opacity})`, // Cor primária para as barras
    labelColor: (opacity = 1) => `rgba(237, 242, 247, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    barPercentage: 0.7, // Barras mais largas
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a202c" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Conversor de Moedas</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="1.00"
            placeholderTextColor="#a0aec0"
          />

          <View style={styles.pickerContainer}>
            {/* ===== PICKER 1 COM VISUAL MELHORADO ===== */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.label}>De</Text>
              <View style={styles.pickerView}>
                <Picker
                  selectedValue={fromCurrency}
                  onValueChange={(itemValue) => setFromCurrency(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem} // Estilo para o texto das opções no iOS
                  dropdownIconColor="#edf2f7"
                >
                  <Picker.Item label="BRL" value="BRL" />
                  <Picker.Item label="USD" value="USD" />
                  <Picker.Item label="EUR" value="EUR" />
                  <Picker.Item label="GBP" value="GBP" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity style={styles.switchButton} onPress={switchCurrencies}>
              <Feather name="repeat" size={20} color="#edf2f7" />
            </TouchableOpacity>

            {/* ===== PICKER 2 COM VISUAL MELHORADO ===== */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.label}>Para</Text>
              <View style={styles.pickerView}>
                <Picker
                  selectedValue={toCurrency}
                  onValueChange={(itemValue) => setToCurrency(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  dropdownIconColor="#edf2f7"
                >
                  <Picker.Item label="BRL" value="BRL" />
                  <Picker.Item label="USD" value="USD" />
                  <Picker.Item label="EUR" value="EUR" />
                  <Picker.Item label="GBP" value="GBP" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{amount || 0} {fromCurrency} =</Text>
            <Text style={styles.resultValue}>{convertedAmount} {toCurrency}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#63b3ed" style={{ marginTop: 20 }} />
        ) : chartData && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Cotação em Relação ao BRL</Text>
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              yAxisLabel="R$ "
              chartConfig={chartConfig} // Usando o objeto de configuração
              style={{ borderRadius: 16 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a202c' },
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#edf2f7', marginBottom: 20 },
  card: { backgroundColor: '#2d3748', borderRadius: 16, padding: 20, width: '100%', elevation: 8 },
  label: { fontSize: 16, color: '#a0aec0', marginBottom: 8 },
  input: { backgroundColor: '#1a202c', color: '#edf2f7', padding: 12, borderRadius: 8, fontSize: 18, marginBottom: 20 },
  pickerContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 },
  
  // ===== ESTILOS NOVOS E AJUSTADOS PARA O PICKER =====
  pickerWrapper: {
    flex: 1,
  },
  pickerView: { // Novo container para dar a aparência de um campo de texto
    backgroundColor: '#1a202c',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    color: '#edf2f7',
  },
  pickerItem: { // Este estilo é principalmente para iOS
    color: '#edf2f7',
  },
  // ===== FIM DOS AJUSTES DO PICKER =====

  switchButton: { backgroundColor: '#4a5568', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, marginBottom: 5 },
  resultContainer: { marginTop: 10, alignItems: 'center' },
  resultText: { fontSize: 18, color: '#a0aec0' },
  resultValue: { fontSize: 32, fontWeight: 'bold', color: '#63b3ed', marginTop: 4 },
  chartContainer: { marginTop: 30, alignItems: 'center' },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#a0aec0', marginBottom: 10 },
});
