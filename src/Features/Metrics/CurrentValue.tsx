import { useEffect } from 'react';
import { IState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { actions, NameValueUnit } from './reducer';

const getMetrics = (state: IState) => {
  const { selectedNames, newMetircsValues } = state.metrics;
  return {
    selectedNames,
    newMetircsValues,
  };
};

export default () => {
  const { selectedNames, newMetircsValues } = useSelector(getMetrics);

  // sorts array of new metrics values based on timestamp
  const sortedMetrics = [...newMetircsValues];
  sortedMetrics.sort((a, b) => {
    return a.at - b.at;
  });

  const lastUnitvalues: NameValueUnit[] = [];

  if (sortedMetrics.length > 5) {
    const len = sortedMetrics.length - 1;
    // pushes the latest value
    for (let i = len; i >= len - 5; i--) {
      lastUnitvalues.push({
        name: sortedMetrics[i].metric,
        value: newMetircsValues[i].value,
        unit: newMetircsValues[i].unit,
        color: '',
      });
    }
  }

  const selectedUnitVal: NameValueUnit[] = [];

  // pushes the latest values for the selected metrics
  selectedNames.forEach(name => {
    // color based on the different metrics name.
    const cN = name.charCodeAt(0) - 96;
    const color = `hsl(${cN * 15}, ${cN * 4}%, 55%)`;
    for (let i of lastUnitvalues) {
      if (name === i.name)
        selectedUnitVal.push({
          name: i.name,
          value: i.value,
          unit: i.unit,
          color: color,
        });
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.storeCurrentValues(selectedUnitVal));
  }, [newMetircsValues, dispatch]);

  return null;
};
