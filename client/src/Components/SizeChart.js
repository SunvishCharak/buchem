import React, { useState } from "react";
import "../Styles/SizeChart.css";

const SizeChartModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button className="size-chart-btn" onClick={openModal}>
        Size Chart
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>
              X
            </button>
            <h2 className="section-title">Size Chart</h2>
            <div className="size-chart">
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust(in)</th>
                    <th>Waist(in)</th>
                    <th>Hip(in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>31</td>
                    <td>25</td>
                    <td>34</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>33</td>
                    <td>27</td>
                    <td>36</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>35</td>
                    <td>29</td>
                    <td>38</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>37</td>
                    <td>31</td>
                    <td>40</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>39</td>
                    <td>33</td>
                    <td>42</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>41</td>
                    <td>35</td>
                    <td>44</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr />
            <p>If you're in-between sizes, we recommend sizing up.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeChartModal;
